import { useState, useEffect } from 'react';
import SimpleLoad from '../SimpleLoad';

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import GiftListItem from './GiftListItem';
import { Gift } from './Gift';

// for the events component, show the loading symbol if still loading,
// otherwise a list of events
function Gifts({loading, gifts}: {loading: boolean, gifts: Gift[] }) {
    if (loading) return <SimpleLoad />;
    if (gifts.length === 0) return <p>No gifts found</p>;

    return <ul className='list-none'>
        {gifts.map((g, i, gifts) => {
            return <GiftListItem key={i} gift={g} last={i + 1 === gifts.length} />
        })}
    </ul>;
}

function EventGifts({eventId}: {eventId: string}) {
    const [loading, setLoading] = useState(true);
    const [gifts, setGifts] = useState([]);


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

    return (
        <Gifts loading={loading} gifts={gifts} />
    )
}

export default EventGifts;
