<template>
    <div class="bg-main-color w-full min-h-screen max-h-max pb-32 mt-6">
        <div class="text-white text-center">
            <h1 class="text-3xl font-bold">Toutes les cartes du jeu</h1>
            <h2>Pour l'instant</h2>
        </div>
        <div class="flex flex-col mt-8">
            <div class="flex flex-col w-full items-center">
                <input name="search" aria-placeholder="search" class="w-1/5 h-12 rounded-lg border-2 border-white bg-main-color text-white pl-2" type="text" placeholder="Rechercher une carte..." v-model="searchName"/>
                <select name="collection" aria-placeholder="collection" class="w-1/5 mt-4 h-12 rounded-lg border-2 border-white bg-main-color text-white" v-model="searchCollection">
                    <option value="">Toutes les collections</option>
                    <option v-for="collection in collections" :value="collection" v-bind:key="collection">{{ collection }}</option>
                </select>
                <button v-on:click="recalculateCards" class="w-1/5 mt-4 h-12 rounded-lg border-2 border-white bg-main-color text-white searchButton">Rechercher</button>
            </div>
            <div v-bind:key="cards">
                <CardsContainer v-for="cardType in Object.keys(cards)" v-bind:key="searchName+cardType" v-bind:title="cardType" v-bind:cards="Object.values(cards[cardType])" class="pt-16 pl-16 pr-16" id="cardContainer"/>
            </div>
        </div>
    </div>
</template>

<script>
import CardsContainer from '@/components/CardsContainer.vue'

let cards = require('../data/cards.json')
let collections = []

Object.keys(cards).forEach(cards_group => {
    Object.keys(cards[cards_group]).forEach(card => {
        if(!collections.includes(cards[cards_group][card].collection)){
            collections.push(cards[cards_group][card].collection)
        }
    });
});

export default {
    name: 'App',
    components: {
        CardsContainer
    },
    data() {
        return {
            cards: cards,
            collections: collections,
            searchName: '',
            searchCollection: ''
        }
    },
    methods: {
        recalculateCards(){
            let newPool = {}
            let old_cards = require('../data/cards.json')

            Object.keys(old_cards).forEach(cards_group => {
                Object.keys(old_cards[cards_group]).forEach(card => {
                    if(newPool[cards_group] == undefined){
                        newPool[cards_group] = {}
                    }
                    if(old_cards[cards_group][card].name.toLowerCase().includes(this.searchName.toLowerCase()) && (old_cards[cards_group][card].collection == this.searchCollection || this.searchCollection == '')){
                        newPool[cards_group][card] = old_cards[cards_group][card]
                    }
                });
            });

            this.cards = newPool
        }
    }
}
</script>

<style scoped>
@media screen and (max-width: 900px){
    #cardContainer {
        padding: 4rem 2rem 0rem 2rem;
    }
}

.searchButton:hover {
    border-color: #A0A0A0;
    color: #A0A0A0;
    transition: all 0.2s ease-in-out;
}
</style>