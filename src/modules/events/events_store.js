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
    async retrieveEvents({commit, state}, force = false) {
        if (state.events.length === 0 || force) { // If no events are loaded
            let events = await EventsApi.getAll();
            commit('SET_ALL_EVENTS', events.data);
        }
        
        return true;
    },

    async retrieveEvent({dispatch, commit, state}, id) {
        const event = await EventsApi.get(id);
        commit('SELECT_EVENT', event.data);
    },

    async unselectEvent({commit}) {
        return commit('SELECT_EVENT', {});
    },

    async storeEvent({dispatch}, event) {
        await  EventsApi.save(event);
        dispatch('retrieveEvents', true);
    },

    async updateEvent({dispatch, commit}, event) {
        await EventsApi.update(event);
        dispatch('retrieveEvents', true);
        commit('SELECT_EVENT', event.id);
    },

    async deleteEvent({dispatch}, id) {
        await EventsApi.delete(id);
        dispatch('retrieveEvents', true);
    },

    async registerEvent({dispatch}, event_id, user_id) {
        await EventsApi.register(event_id, user_id);
        dispatch('retrieveEvents', true);
    },
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
