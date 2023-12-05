import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import SimpleLoad from '../SimpleLoad';

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import GiftListItem from './GiftListItem';
import { Gift } from './Gift';
import { checkOwnerShip } from '../../helpers/paths';

// for the events component, show the loading symbol if still loading,
// otherwise a list of events
function Gifts({loading, gifts}: {loading: boolean, gifts: Gift[]}) {
    if (loading) return <SimpleLoad />;
    if (gifts.length === 0) return <p className="m-3">No gifts found</p>;

    // if owner is viewing, filter out any gifts added by guests and not the owner
    const listOwnership = checkOwnerShip();
    if (listOwnership) {
        gifts = gifts.filter(g => {
            console.log(g.creatorId)
            return typeof g.creatorId === "undefined" || g.creatorId === window.usr?.id
        })
    }

    return <ul className='list-none'>
        {gifts.map((g, i) => {
            return <GiftListItem gift={g} key={i} isOwner={g.creatorId == window.usr.id || listOwnership} />
        })}
    </ul>;
}

function EventGifts({eventId, giftQueue, setQueue}: {eventId: string, giftQueue: Gift[], setQueue: Dispatch<SetStateAction<Gift[]>>}) {
    const [loading, setLoading] = useState(true);
    const initGifts: Gift[] = [];
    const [gifts, setGifts] = useState(initGifts);

    // load event gifts after first render
    useEffect(() => {
        // get gifts from dynamodb
        const getGifts = async () => {
            const command = new QueryCommand({
                TableName: window.app.tableName,
                KeyConditionExpression: 'itemType = :itemType AND begins_with(itemId, :itemId)',
                ExpressionAttributeValues: {
                    ":itemType": "gift",
                    ":itemId": `${eventId}/gifts/`
                }
            });

            const data = await window.ddb.send(command);
            setGifts(data.Items);
        }

        getGifts().then(() => setLoading(false)).catch(e => console.error(e));
    }, []);
    useEffect(() => {
        if (giftQueue.length > 0) {
            const newGifts = [...gifts];
            for (let i = 0; i < giftQueue.length; i++) {
                const newGift = giftQueue[i];
                newGifts.push(newGift);
            }
            setQueue([]);
            setGifts(newGifts)
        }
    }, [giftQueue])

    return (
        <Gifts loading={loading} gifts={gifts} />
    )
}

export default EventGifts;
