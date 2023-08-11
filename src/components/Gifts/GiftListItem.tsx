import { Gift } from './Gift';

function GiftListItem({gift, last}: {gift: Gift, last: boolean}) {
    const title = gift.title || 'Gift';
    const desc = gift.description || '';

    return <li className="shadow-dark-out rounded-lg p-7 mt-7">
        <h3 className="font-extrabold text-5xl">
            { title }
        </h3>

        <p className="font-normal">{ desc }</p>
    </li>
}

export default GiftListItem;
