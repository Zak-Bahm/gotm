import { useState } from "react";
import { GiftIdea } from "./Gift";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

function GiftIdeaCard({idea, onAction, actionIcon, actionAriaLabel = 'Use gift idea'}: {idea: GiftIdea, onAction: (idea: GiftIdea) => Promise<void>, actionIcon: IconDefinition, actionAriaLabel?: string}) {
    const [isProcessing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleAction = async () => {
        if (isProcessing) return;
        setProcessing(true);
        setError('');
        try {
            await onAction(idea);
        } catch (e) {
            console.error(e);
            setError('Unable to process this idea.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <li className="shadow-dark-out rounded-lg p-3 flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2">
                <h4 className="font-extrabold text-lg truncate">{ idea.title || 'Gift Idea' }</h4>
                <button
                    className="shadow-light-in bg-gray-700 rounded-lg p-2 flex items-center justify-center disabled:opacity-50"
                    onClick={handleAction}
                    disabled={isProcessing}
                    aria-label={actionAriaLabel}
                >
                    <FontAwesomeIcon icon={actionIcon} />
                </button>
            </div>
            { idea.description ? <p className="text-sm">{ idea.description }</p> : null }
            { error.length > 0 ? <p className="text-red-400 text-xs mt-1">{ error }</p> : null }
        </li>
    );
}

export default GiftIdeaCard;
