import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { PutCommand, DeleteCommand, DeleteCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Gift } from './Gift';

function giftAction(gift: Gift, isOwner: boolean, hideGift: () => void) {
    // if owner return delete button early
    if (isOwner) {
        return <span>
            <button onClick={async () => {
                const removed = await removeGift(gift);
                if (removed) hideGift();
            } } className='mt-6 shadow-light-in bg-gray-700 rounded-lg p-3 text-2xl font-extrabold'>
                Remove Gift
            </button>
        </span>
    }

    // setup reserved state
    const [reserved, setReserved] = useState(gift.giverId !== '');
    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setReserved(isChecked);

        gift = await reserveGift(gift, isChecked);
    };

    // check if it is reserved by someone else
    const otherReserved = (gift.giverId !== '' && gift.giverId !== window.usr?.id);

    if (otherReserved) {
        return <p className="font-extrabold text-2xl pt-6 px-4">
            { gift.giverName} has reserved this gift
        </p>
    }

    return <span className="flex">
        <label htmlFor={`reserved-${gift.createdTs}`} className="font-extrabold text-2xl pt-6 px-4 custom-checkbox items-baseline cursor-pointer">
            <input id={`reserved-${gift.createdTs}`} type="checkbox" name={`reserved-${gift.createdTs}`} onChange={handleCheckboxChange} checked={reserved} />
            Reserve this gift
        </label>
    </span>
}

async function removeGift(gift: Gift): Promise<boolean> {
    // ensure item id is present
    if (gift.itemId === undefined) return false;

    // send delete command and parse response
    const command = new DeleteCommand({
        TableName: window.app.tableName,
        Key: {
            itemType: 'gift',
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

function GiftListItem({gift, isOwner}: {gift: Gift, isOwner: boolean}) {
    const title = gift.title || 'Gift';
    const desc = gift.description || '';
    const store = gift.store || '';
    const url = gift.url || false;

    // setup gift hide action for deletion
    const [hidden, setHidden] = useState(false);
    const hideRemovedGift = () => { setHidden(true) };
    const hide = useSpring({
        to: {
            opacity: hidden ? 0 : 1,
            height: hidden ? 0 : 'auto',
            y: hidden ? -20 : 0,
            padding: hidden ? '0rem' : '1.75rem',
            margin: hidden ? '0rem' : '0.75rem'
        }
    });

    return <animated.li style={{...hide}} className="shadow-dark-out rounded-lg p-7 m-3 grid grid-cols-1 justify-start">
            <div className="flex justify-between items-center">
                <p className="font-extrabold text-2xl grow">
                    { title }
                </p>
                <p className="text-xl">
                    { store || url ? 'Find it at ' : ''}
                    {
                        url ?
                        <a href={ url } target='_blank' className='font-extrabold'>
                            { store || url }
                        </a>
                        :
                        <span className='font-extrabold'>
                            { store }
                        </span>
                    }
                </p>
            </div>
            <p className="font-thin">{ desc }</p>
            { giftAction(gift, isOwner, hideRemovedGift) }
    </animated.li>
}

export default GiftListItem;
