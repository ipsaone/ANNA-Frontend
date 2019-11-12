import EventsApi from '@/modules/events/events_api';

const state = {
    events: [],
    event: {}
};

const mutations = {
    SET_ALL_EVENTS(state, events) {
        state.events = events;
    },

    SELECT_EVENT(state, evt) {
        state.event = evt;
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
        return dispatch('retrieveEvents', true);
    },

    async updateEvent({dispatch, commit}, event) {
        console.log('store', event);
        await EventsApi.update(event);
        await dispatch('retrieveEvents', true);
        commit('SELECT_EVENT', event.id);
    },

    async deleteEvent({dispatch}, id) {
        await EventsApi.delete(id);
        return dispatch('retrieveEvents', true);
    },

    async addEventMember({dispatch, state}, user_id) {
        let data = await EventsApi.register(state.event.id, user_id);
        return dispatch('retrieveEvent', state.event.id);
    },

    async remEventMember({dispatch, state}, user_id) {
        let data = await EventsApi.withdraw(state.event.id, user_id);
        return dispatch('retrieveEvent', state.event.id);
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
