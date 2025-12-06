import { useEffect, useState } from "react";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { GiftIdea } from "./Gift";
import GiftIdeaCard from "./GiftIdeaCard";
import SimpleLoad from "../SimpleLoad";
import { buildGiftIdeaFromTitle, deleteGiftIdea, saveGiftIdea } from "./giftIdeas";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface GiftIdeasListProps {
    title?: string;
    emptyMessage?: string;
    hidden?: boolean;
    actionIcon?: IconDefinition;
    actionAriaLabel?: string;
    onIdeaAction?: (idea: GiftIdea) => Promise<void>;
    allowCreate?: boolean;
}

function GiftIdeasList({title = "Saved Gift Ideas", emptyMessage = "You haven't saved any gift ideas yet.", hidden = false, actionIcon = faTrash, actionAriaLabel = "Remove gift idea", onIdeaAction, allowCreate = true}: GiftIdeasListProps) {
    const [ideas, setIdeas] = useState<GiftIdea[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newIdeaTitle, setNewIdeaTitle] = useState('');
    const [newIdeaError, setNewIdeaError] = useState('');
    const [isSavingIdea, setIsSavingIdea] = useState(false);

    useEffect(() => {
        if (hidden) {
            setIdeas([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const loadIdeas = async () => {
            const userId = window.usr?.id || '';
            if (userId.length === 0) {
                setIdeas([]);
                return;
            }
            const command = new QueryCommand({
                TableName: window.app.tableName,
                KeyConditionExpression: 'itemType = :itemType AND begins_with(itemId, :itemId)',
                ExpressionAttributeValues: {
                    ":itemType": "gift-idea",
                    ":itemId": `${userId}/gift-ideas/`
                }
            });
            const data = await window.ddb.send(command);
            setIdeas(data.Items || []);
        };

        loadIdeas()
            .catch(e => {
                console.error(e);
                setError('Unable to load your gift ideas right now.');
            })
            .finally(() => setLoading(false));
    }, [hidden]);

    const handleAction = async (idea: GiftIdea) => {
        if (onIdeaAction) {
            await onIdeaAction(idea);
            setIdeas(prev => prev.filter(i => i.itemId !== idea.itemId));
            return;
        }

        const success = await deleteGiftIdea(idea.itemId);
        if (!success) throw new Error('Unable to delete');
        setIdeas(prev => prev.filter(i => i.itemId !== idea.itemId));
    };

    const handleCreateIdea = async () => {
        const trimmed = newIdeaTitle.trim();
        if (trimmed.length === 0 || isSavingIdea) {
            setNewIdeaError('Please enter a title first.');
            return;
        }
        setIsSavingIdea(true);
        setNewIdeaError('');
        try {
            const idea = buildGiftIdeaFromTitle(trimmed);
            await saveGiftIdea(idea);
            setIdeas(prev => [idea, ...prev]);
            setNewIdeaTitle('');
        } catch (e) {
            console.error(e);
            setNewIdeaError('Unable to save your idea. Please try again.');
        } finally {
            setIsSavingIdea(false);
        }
    };

    if (hidden) return null;

    return (
        <div className="m-5">
            <h3 className="font-extrabold text-2xl mb-4">{ title }</h3>
            { allowCreate ? (
                <div className="flex flex-col gap-3 mb-4 md:flex-row">
                    <input
                        type="text"
                        className="shadow-light-in bg-gray-700 rounded-lg p-3 flex-1"
                        placeholder="Have a quick idea?"
                        value={newIdeaTitle}
                        onChange={(e) => {
                            setNewIdeaTitle(e.target.value);
                            if (newIdeaError.length > 0) setNewIdeaError('');
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCreateIdea();
                            }
                        }}
                    />
                    <button
                        className="shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold disabled:opacity-50"
                        onClick={handleCreateIdea}
                        disabled={isSavingIdea}
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} className='me-1' />
                        { isSavingIdea ? 'Saving...' : 'Save Idea' }
                    </button>
                </div>
            ) : null }
            { allowCreate && newIdeaError.length > 0 ? <p className="text-red-400 text-sm mb-4">{ newIdeaError }</p> : null }
            { loading ? (
                <SimpleLoad />
            ) : ideas.length === 0 ? (
                <p className="text-sm text-gray-300">{ emptyMessage }</p>
            ) : (
                <ul className="grid gap-4 lg:grid-cols-6 md:grid-cols-3 grid-cols-2">
                    { ideas.map((idea) => (
                        <GiftIdeaCard key={idea.itemId} idea={idea} onAction={handleAction} actionIcon={actionIcon} actionAriaLabel={actionAriaLabel} />
                    )) }
                </ul>
            ) }
            { error.length > 0 ? <p className="text-red-400 text-sm mt-3">{ error }</p> : null }
        </div>
    );
}

export default GiftIdeasList;
