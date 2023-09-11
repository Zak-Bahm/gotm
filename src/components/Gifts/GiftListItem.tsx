import { Gift } from './Gift';

function GiftListItem({gift}: {gift: Gift}) {
    const title = gift.title || 'Gift';
    const desc = gift.description || '';

    return <li className="shadow-dark-out rounded-lg p-7 m-3">
        <h3 className="font-extrabold text-5xl">
            { title }
        </h3>

        <p className="font-normal">{ desc }</p>
    </li>
}

export default GiftListItem;
