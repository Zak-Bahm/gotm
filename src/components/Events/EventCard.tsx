import { formatDistanceToNow } from 'date-fns';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import SimpleLoad from '../SimpleLoad';
import { GotmEvent } from './Event';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { faFloppyDisk, faPenToSquare, faUsersViewfinder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { checkOwnerShip, encodeEventPath } from '../../helpers/paths';
import { putEvent } from '../GroupEvents/AddEventForm';
import { saveEvent } from './saveEvent';

// for the events component, show the loading symbol if still loading,
// otherwise an event card
function DynEventCard({loading, event, setEvent}: {loading: boolean, event: GotmEvent | false, setEvent: Dispatch<SetStateAction<GotmEvent | false>> }) {
    if (loading) return <SimpleLoad />;
    if (event === false) return <div className="shadow-dark-out rounded-lg p-7 mt-7 grid grid-flow-row auto-rows-max">
        <div className="flex justify-between items-center">
            <h5 className="font-extrabold text-3xl">
                Unable to load Event
            </h5>
        </div>
    </div>

    return <EventCard event={event} setEvent={setEvent} />;
}

function LoadEventCard({eventId, onEventChange}: {eventId: string, onEventChange?: (event: GotmEvent | null) => void}) {
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<GotmEvent | false>(false);
    const updateEvent: Dispatch<SetStateAction<GotmEvent | false>> = (value) => {
        setEvent(prev => {
            const next = typeof value === 'function' ? (value as (current: GotmEvent | false) => GotmEvent | false)(prev) : value;
            if (typeof onEventChange === 'function') {
                onEventChange(next === false ? null : next);
            }
            return next;
        });
    };

    // load event after first render
    useEffect(() => {
        // get events
        const getEvents = async () => {
            const command = new GetCommand({
                TableName: window.app.tableName,
                Key: {
                    itemType: "event",
                    itemId: eventId
                }
            });

            const data = await window.ddb.send(command);
            if (typeof data.Item != 'undefined') {
                updateEvent(data.Item);
            } else {
                updateEvent(false);
            }
        }

        getEvents().then(() => setLoading(false)).catch(e => console.error(e));
    }, []);

    return (
        <DynEventCard loading={loading} event={event} setEvent={updateEvent} />
    )
}

async function leaveGroup(event: GotmEvent, setInGroup: (u: boolean) => void) {
    // ensure we have a group id
    if (typeof event.groupEventId == 'undefined' || event.groupEventId === '') return;

    // first remove link from group event
    await putEvent(false, event.groupEventId);

    // then update event group participation
    event.groupEventId = '';
    setInGroup(false);
}

function EventCard({event, setEvent}: {event: GotmEvent, setEvent: Dispatch<SetStateAction<GotmEvent | false>>}) {
    const name = event.name || '';
    const groupId = event.groupEventId || '';
    const groupPath = '/' + (encodeEventPath(groupId) || '#');
    const [inGroup, setInGroup] = useState(groupId.length > 0);
    const ownedEvent = checkOwnerShip(event.itemId);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [editValues, setEditValues] = useState({
        title: event.title || '',
        description: event.description || '',
        endTs: event.endTs || 0
    });
    const eventEndTs = event.endTs || 0;
    const eventHasPassed = eventEndTs !== 0 && eventEndTs < Date.now();

    useEffect(() => {
        setEditValues({
            title: event.title || '',
            description: event.description || '',
            endTs: event.endTs || 0
        });
    }, [event]);
    useEffect(() => {
        if (eventHasPassed) {
            setIsEditing(false);
        }
    }, [eventHasPassed]);

    const currentEndTs = (isEditing ? editValues.endTs : event.endTs) || 0;
    const displayTitle = isEditing ? editValues.title : (event.title || 'Event');
    const displayDesc = isEditing ? editValues.description : (event.description || '');

    // determine formatted date string and time left
    let endDate = '';
    let timeLeft = '';
    if (currentEndTs !== 0) {
        const date = new Date(currentEndTs);
        endDate = date.toLocaleDateString();
        timeLeft = formatDistanceToNow(date, { addSuffix: true });
    }

    const formatDateInputValue = (timestamp: number) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const year = date.getUTCFullYear();
        const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
        const day = `${date.getUTCDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const canSave = editValues.title.trim().length > 0 && editValues.endTs !== 0;

    const handleEditClick = async () => {
        if (eventHasPassed) return;
        if (!isEditing) {
            setIsEditing(true);
            setError('');
            return;
        }

        if (!canSave) return;

        setIsSaving(true);
        setError('');
        try {
            const updatedEvent: GotmEvent = {
                ...event,
                title: editValues.title,
                description: editValues.description,
                endTs: editValues.endTs
            };
            await saveEvent(updatedEvent);
            setEvent(updatedEvent);
            setIsEditing(false);
        } catch (e) {
            console.error(e);
            setError('Unable to save your changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError('');
        setEditValues({
            title: event.title || '',
            description: event.description || '',
            endTs: event.endTs || 0
        });
    };

    return (
        <div className="shadow-dark-out rounded-lg m-3 p-5 lg:p-10">
            <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-5xl w-full">
                    { isEditing ? (
                        <input
                            className="w-full shadow-light-in bg-gray-700 rounded-lg p-3 text-3xl"
                            value={editValues.title}
                            onChange={(e) => setEditValues(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Event title"
                        />
                    ) : (
                        displayTitle
                    ) }
                </h3>
            </div>

            <div className="flex justify-between items-center my-3 mt-10 gap-3 flex-wrap">
                <span className="text-emerald-400 text-xl">{ timeLeft }</span>
                { isEditing ? (
                    <input
                        type="date"
                        className="shadow-light-in bg-gray-700 rounded-lg p-3 text-xl"
                        value={formatDateInputValue(editValues.endTs)}
                        min={formatDateInputValue(Date.now())}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!value) return;
                            const newTs = new Date(value).valueOf();
                            setEditValues(prev => ({ ...prev, endTs: newTs }));
                        }}
                    />
                ) : (
                    <span className="font-bold text-3xl">{ endDate }</span>
                ) }
            </div>

            <div className="flex justify-between items-center my-3">
                <span className="text-xl">Creator: </span>
                <span className="text-emerald-400 text-xl">{ name }</span>
            </div>

            { inGroup ? <div className="flex justify-between items-center my-3 mt-10">
                <span className="font-bold text-2xl">Related events: </span>
                <Link to={ groupPath }>
                    <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold'>
                        <FontAwesomeIcon icon={faUsersViewfinder} className='me-1' />
                        View Group
                    </button>
                </Link>
            </div> : "" }

            { (displayDesc.length > 0 || isEditing) ? <div className="mt-10 w-full">
                <h5 className="font-extrabold text-xl mb-3">What&apos;s it about?</h5>
                { isEditing ? (
                    <textarea
                        className="w-full shadow-light-in bg-gray-700 rounded-lg p-3"
                        rows={5}
                        value={editValues.description}
                        onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Tell everyone about your event"
                    />
                ) : (
                    <p className="font-normal">{ displayDesc }</p>
                ) }
            </div> : "" }

            { ownedEvent && !eventHasPassed ? <div className="mt-10">
                <h3 className="font-bold text-2xl">
                    Actions
                </h3>
                <div className="flex flex-wrap gap-3 items-center mt-3">
                    { inGroup ? <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold disabled:opacity-50' onClick={async () => {leaveGroup(event, setInGroup)}} disabled={eventHasPassed}>
                        <FontAwesomeIcon icon={faUsersViewfinder} className='me-1' />
                        Leave Group
                    </button> : "" }
                    <button
                        className='shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold disabled:opacity-50 flex items-center'
                        onClick={handleEditClick}
                        disabled={eventHasPassed || isSaving || (isEditing && !canSave)}
                    >
                        { isEditing ? (
                            <>
                                <FontAwesomeIcon icon={faFloppyDisk} className='me-1' />
                                { isSaving ? 'Saving...' : 'Save' }
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faPenToSquare} className='me-1' />
                                Edit Event
                            </>
                        ) }
                    </button>
                    { isEditing ? <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold' onClick={handleCancel} disabled={isSaving}>
                        Cancel
                    </button> : "" }
                </div>
                { error.length > 0 ? <p className="text-red-400 mt-3">{ error }</p> : "" }
            </div> : "" }
        </div>
    )
}

export { EventCard, LoadEventCard };
