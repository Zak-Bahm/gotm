import { useState } from 'react';
import { PutCommand, PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Gift } from './Gift';

async function reserveGift(gift: Gift, reserved: boolean): Promise<Gift> {
    // set giver info
    gift.giverName = reserved ? window.usr?.name : '';
    gift.giverId = reserved ? window.usr?.id : '';

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

    // setup reserved state
    const [reserved, setReserved] = useState(gift.giverId !== '');
    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setReserved(isChecked);

        gift = await reserveGift(gift, isChecked);
    };

    // check if it is reserved by someone else
    const otherReserved = (gift.giverId !== '' && gift.giverId !== window.usr?.id);

    return <li className="shadow-dark-out rounded-lg p-7 m-3 grid justify-items-start">
            <p className="font-extrabold text-2xl">
                { title }
            </p>
            <p className="font-thin">{ desc }</p>
            { !isOwner && (
                otherReserved ?
                <p className="font-extrabold text-2xl pt-6 px-4">
                    { gift.giverName} has reserved this gift
                </p>
                :
                <label htmlFor="reserved" className="font-extrabold text-2xl pt-6 px-4 custom-checkbox items-baseline cursor-pointer">
                    <input id="reserved" type="checkbox" name="reserved" onChange={handleCheckboxChange} checked={reserved} />
                    Reserve this gift
                </label>
            )
            }
    </li>
}

export default GiftListItem;
