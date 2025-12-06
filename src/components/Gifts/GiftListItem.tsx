import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { PutCommand, DeleteCommand, DeleteCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Gift, GiftIdea } from './Gift';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faLink, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { saveGift } from './saveGift';
import { buildGiftIdeaFromGift, saveGiftIdea } from './giftIdeas';

async function removeGift(gift: Gift): Promise<boolean> {
    // ensure item id is present
    if (gift.itemId === undefined) return false;

    // send delete command and parse response
    const command = new DeleteCommand({
        TableName: window.app.tableName,
        Key: {
            itemType: gift.itemType,
            itemId: gift.itemId
        }
    });
    const resp: DeleteCommandOutput = await window.ddb.send(command);
    const success = resp.$metadata.httpStatusCode === 200;

    return success
}

async function reserveGift(gift: Gift, reserved: boolean): Promise<Gift> {
    // set giver info
    gift.giverName = '';
    gift.giverId = '';
    if (reserved) {
        gift.giverName = window.usr.name ?? '';
        gift.giverId = window.usr.id ?? '';
    }

    const command = new PutCommand({
        TableName: window.app.tableName,
        Item: gift
    });
    await window.ddb.send(command);

    return gift
}

function GiftListItem({gift, readOnly = false, canSaveIdea = false}: {gift: Gift, readOnly?: boolean, canSaveIdea?: boolean}) {
    const [giftData, setGiftData] = useState(gift);
    const [hidden, setHidden] = useState(false);
    const [isRemoved, setIsRemoved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [editValues, setEditValues] = useState({
        title: gift.title || '',
        description: gift.description || '',
        store: gift.store || '',
        url: gift.url || ''
    });
    const [reserved, setReserved] = useState(gift.giverId !== '');
    const [ideaSaved, setIdeaSaved] = useState(false);
    const [ideaSaving, setIdeaSaving] = useState(false);
    const [ideaError, setIdeaError] = useState('');

    const hide = useSpring({
        opacity: hidden ? 0 : 1,
        transform: hidden ? 'translateY(-20px)' : 'translateY(0px)',
        onRest: () => {
            if (hidden) setIsRemoved(true);
        }
    });

    const resetEditValues = () => setEditValues({
        title: giftData.title || '',
        description: giftData.description || '',
        store: giftData.store || '',
        url: giftData.url || ''
    });

    const formattedStore = isEditing ? editValues.store : (giftData.store || '');
    const formattedTitle = isEditing ? editValues.title : (giftData.title || 'Gift');
    const formattedDesc = isEditing ? editValues.description : (giftData.description || '');
    const formattedUrl = isEditing ? editValues.url : (giftData.url || '');
    const creatorOnly = gift.creatorId === window.usr?.id;

    const handleReserveChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setReserved(isChecked);

        const updatedGift = await reserveGift({ ...giftData }, isChecked);
        setGiftData(updatedGift);
    };

    const otherReserved = (giftData.giverId !== '' && giftData.giverId !== window.usr?.id);
    const canSave = editValues.title.trim().length > 0;

    const handleSave = async () => {
        if (!isEditing) {
            setIsEditing(true);
            setError('');
            return;
        }
        if (!canSave) return;

        setIsSaving(true);
        setError('');
        try {
            const newGift = { ...giftData, ...editValues };
            await saveGift(newGift);
            setGiftData(newGift);
            setIsEditing(false);
        } catch (e) {
            console.error(e);
            setError('Unable to save the gift. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setError('');
        resetEditValues();
    };

    const handleRemove = async () => {
        const removed = await removeGift(giftData);
        if (removed) setHidden(true);
    };

    const canCreateIdea = readOnly && canSaveIdea && giftData.giverId === '' && !ideaSaved;

    const handleSaveIdea = async () => {
        if (!canCreateIdea || ideaSaving) return;
        if (!window.usr?.id) {
            setIdeaError('Please log in to save ideas.');
            return;
        }
        setIdeaSaving(true);
        setIdeaError('');
        try {
            const idea: GiftIdea = buildGiftIdeaFromGift(giftData);
            await saveGiftIdea(idea);
            setIdeaSaved(true);
        } catch (e) {
            console.error(e);
            setIdeaError('Unable to save this idea.');
        } finally {
            setIdeaSaving(false);
        }
    };

    if (isRemoved) return null;

    return <animated.li style={{...hide}} className="shadow-dark-out rounded-lg p-7 m-3 grid grid-cols-1 justify-start">
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-between items-center gap-4">
            <p className="font-extrabold text-2xl grow w-full">
                { isEditing ? (
                    <input
                        className="w-full shadow-light-in bg-gray-700 rounded-lg p-3"
                        value={editValues.title}
                        onChange={(e) => setEditValues(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Gift title"
                    />
                ) : (
                    formattedTitle
                ) }
            </p>
            <div className="text-xl my-3 lg:m-0 w-full">
                { isEditing ? (
                    <>
                        <label className="font-extrabold text-lg mb-2 block">Where can they get it?</label>
                        <input
                            className="w-full shadow-light-in bg-gray-700 rounded-lg p-3 mb-3"
                            value={editValues.store}
                            onChange={(e) => setEditValues(prev => ({ ...prev, store: e.target.value }))}
                            placeholder="Store"
                        />
                        <label className="font-extrabold text-lg mb-2 block">What&apos;s the link?</label>
                        <input
                            className="w-full shadow-light-in bg-gray-700 rounded-lg p-3"
                            value={editValues.url}
                            onChange={(e) => setEditValues(prev => ({ ...prev, url: e.target.value }))}
                            placeholder="https://example.com"
                        />
                    </>
                ) : (
                    <p>
                        { formattedStore || formattedUrl ? 'Find it at ' : ''}
                        {
                            formattedUrl ?
                            <a href={ formattedUrl } target='_blank' className='font-extrabold'>
                                { formattedStore || 'this link' }
                                <FontAwesomeIcon icon={faLink} className='ms-1' />
                            </a>
                            :
                            <span className='font-extrabold'>
                                { formattedStore }
                            </span>
                        }
                    </p>
                ) }
            </div>
        </div>
        <div className="mt-4 w-full">
            { isEditing ? (
                <>
                    <label className="font-extrabold text-lg mb-2 block">What is it?</label>
                    <textarea
                        className="w-full shadow-light-in bg-gray-700 rounded-lg p-3"
                        rows={4}
                        value={editValues.description}
                        onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                    />
                </>
            ) : (
                <p className="font-thin">{ formattedDesc }</p>
            ) }
        </div>

        { readOnly ? (
            <div className="flex flex-wrap items-center gap-3 mt-6 px-4">
                <p className="font-extrabold text-2xl">
                    { giftData.giverId ? `${giftData.giverName || 'Someone'} has reserved this gift` : 'This gift was not reserved.' }
                </p>
                { canCreateIdea ? (
                    <button
                        className='shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold disabled:opacity-50'
                        onClick={handleSaveIdea}
                        disabled={ideaSaving}
                    >
                        { ideaSaving ? 'Saving...' : 'Save as Idea' }
                    </button>
                ) : null }
                { ideaSaved ? <span className="text-emerald-400 font-bold text-base">Saved!</span> : null }
                { ideaError.length > 0 ? <span className="text-red-400 font-bold text-base">{ ideaError }</span> : null }
            </div>
        ) : creatorOnly ? (
            <div className="flex flex-wrap gap-3 mt-6">
                <button
                    onClick={handleSave}
                    disabled={isSaving || (isEditing && !canSave)}
                    className='shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold flex items-center disabled:opacity-50'
                >
                    { isEditing ? (
                        <>
                            <FontAwesomeIcon icon={faFloppyDisk} className='me-1' />
                            { isSaving ? 'Saving...' : 'Save Gift' }
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faPenToSquare} className='me-1' />
                            Edit Gift
                        </>
                    ) }
                </button>
                { isEditing ? <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold' onClick={handleCancelEdit} disabled={isSaving}>Cancel</button> : null }
                <button onClick={handleRemove} className='shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold'>
                    <FontAwesomeIcon icon={faTrash} className='me-1' />
                    Remove Gift
                </button>
                { error.length > 0 ? <p className="text-red-400 w-full">{ error }</p> : null }
            </div>
        ) : otherReserved ? (
            <p className="font-extrabold text-2xl pt-6 px-4">
                { giftData.giverName} has reserved this gift
            </p>
        ) : (
            <span className="flex">
                <label htmlFor={`reserved-${giftData.createdTs}`} className="font-extrabold text-2xl pt-6 px-4 custom-checkbox items-baseline cursor-pointer">
                    <input id={`reserved-${giftData.createdTs}`} type="checkbox" name={`reserved-${giftData.createdTs}`} onChange={handleReserveChange} checked={reserved} />
                    Reserve this gift
                </label>
            </span>
        ) }
    </animated.li>
}

export default GiftListItem;
