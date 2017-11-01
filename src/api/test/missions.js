const _missions = [
    {
        id: 1,
        title: `Dev d\'un moteur blablabla`,
        abstract: `Très très longue description avec plein d'àccênts partout pour vérifier les histoires d'encodage et de popup parce que putain c'est long et chiant à écrire. Bon du coup je vous laisse, bisous.`,
        team: {manager: 1, members: [2,3,4]},
        money: {used: 30, total: 1000},
        tasks: [
            {title: 'blabla', done: true}, 
            {title: 'truc', done: false}, 
            {title: 'truc', done: false}, 
            {title: 'machin', done: false}
        ]

    },
    {
        id: 2,
        title: `Création de ANNA parce que c'est super cool`,
        abstract: `Très très longue description avec plein d'àccênts partout pour vérifier les histoires d'encodage et de popup parce que putain c'est long et chiant à écrire. Bon du coup je vous laisse, bisous.`,
        team: {manager: 4, members: [1,2,3]},
        money: {used: 30, total: 120},
        tasks: [
            {title: 'blabla', done: true}, 
            {title: 'truc', done: false}, 
            {title: 'truc', done: false}, 
            {title: 'machin', done: false}
        ]
    }
];

export default {
    getAll() {
        return new Promise(resolve => resolve(_posts));
    },

    getMissionById(id) {
        return new Promise(resolve => 
            resolve(_missions.filter(mission => mission.id === parseInt(id))[0])
        );
    },

    updateMission(id) {
        
    },

    deleteMission(id) {

    },


}