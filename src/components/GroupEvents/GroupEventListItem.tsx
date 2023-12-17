import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import SimpleLoad from '../SimpleLoad';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { GroupEvent } from './GroupEvent';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { encodeEventPath } from '../../helpers/paths';
import { faUsersViewfinder } from '@fortawesome/free-solid-svg-icons';

// show the loading symbol if still loading,
// otherwise a group list item
function DynGroupEventListItem({loading, group}: {loading: boolean, group: GroupEvent | false }) {
    if (loading) return <SimpleLoad />;
    if (group === false) return <div className="shadow-dark-out rounded-lg p-7 mt-7 grid grid-flow-row auto-rows-max">
        <div className="flex justify-between items-center">
            <h5 className="font-extrabold text-3xl">
                Unable to load Group Event
            </h5>
        </div>
    </div>

    return <GroupEventListItem group={group} />;
}

function LoadGroupEventListItem({groupId}: {groupId: string}) {
    const [loading, setLoading] = useState(true);
    const [group, setGroup] = useState<GroupEvent | false>(false);

    // load event after first render
    useEffect(() => {
        // get group
        const getGroup = async () => {
            const command = new GetCommand({
                TableName: window.app.tableName,
                Key: {
                    itemType: "group-event",
                    itemId: groupId
                }
            });

            const data = await window.ddb.send(command);
            if (typeof data.Item != 'undefined') setGroup(data.Item);
        }

        getGroup().then(() => setLoading(false)).catch(e => console.error(e));
    }, []);

    return (
        <DynGroupEventListItem loading={loading} group={group} />
    )
}

function GroupEventListItem({group}: {group: GroupEvent}) {
    const title = group.title || '';
    const name = group.name || '';
    const desc = group.description || '';
    const endTs = group.endTs || 0;
    const path = encodeEventPath(group.itemId) || '#';

    // check if current url is the group path
    const viewingGroupPage = window.location.pathname === '/' + path;

    // determine formatted date string and time left
    let endDate = '';
    let timeLeft = '';
    if (endTs !== 0) {
        endDate = new Date(endTs).toLocaleDateString();
        timeLeft = formatDistanceToNow(new Date(endTs), { addSuffix: true })
    }

    return (
        <li className="shadow-dark-out rounded-lg p-7 mt-7 grid grid-flow-row auto-rows-max">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                <h3 className="font-extrabold text-4xl mb-3">
                    <span className="text-emerald-400">Group Event: </span>{ title }
                </h3>
                { !viewingGroupPage ? <Link to={ path } className="grid lg:justify-items-end">
                    <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-xl font-extrabold'>
                        <FontAwesomeIcon icon={faUsersViewfinder} className="me-1" />
                        View Group Event
                    </button>
                </Link> : "" }
            </div>

            <div className="flex justify-between items-center my-3">
                <span className="text-emerald-400 text-xl">{ timeLeft }</span>
                <span className="font-bold text-3xl">{ endDate }</span>
            </div>

            <div className="flex justify-between items-center my-3">
                <span className="text-xl">Creator: </span>
                <span className="text-emerald-400 text-xl">{ name }</span>
            </div>

            { desc.length > 0 ? <div>
                <h5 className="font-extrabold text-xl mb-3">What&apos;s it about?</h5>
                <p className="font-normal">{ desc }</p>
            </div> : "" }
        </li>
    )
}

export { GroupEventListItem, LoadGroupEventListItem };
