import EventsApi from '@/modules/events/events_api';

const state = {
    events: [],
    event: {}
};

const mutations = {
    SET_ALL_EVENTS(state, events) {
        state.events = events;
    },

    SELECT_EVENT(state, event) {
        state.event = event;
    },

    CLEAR_EVENT(state) {
        state.event = {};
    }
};

const actions = {
    retrieveEvents({commit, state}, force = false) {
        if (state.events.length === 0 || force) { // If no events are loaded
            return EventsApi.getAll().then(events => commit('SET_ALL_EVENTS', events.data));
        }
        else {
            Promise.resolve();
        }
    },

    async retrieveEvent({dispatch, commit, state}, id) {
        const event = await EventsApi.get(id);
        commit('SELECT_EVENT', event.data);
    },

    unselectEvent({commit}) {
        return commit('SELECT_EVENT', {});
    },

    storeEvent({dispatch}, event) {
        return EventsApi.save(event)
            .then(_ => dispatch('retrieveEvents', true));
    },

    updateEvent({dispatch}, event) {
        return EventsApi.update(event)
            .then(_ => dispatch('retrieveEvents', true))
            .then(_ => dispatch('selectEvent', event.id));
    },

    deleteEvent({dispatch}, id) {
        return EventsApi.delete(id)
            .then(_ => dispatch('retrieveEvents', true));
    },

    registerEvent({dispatch}, event_id, user_id) {
        return EventsApi.register(event_id, user_id)
            .then(_ => dispatch('retrieveEvents', true));
    }
};

const getters = {
    events(state) {
        return state.events;
    },

    selectedEvent(state) {
        return state.event;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
