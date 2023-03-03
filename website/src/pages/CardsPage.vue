<template>
    <div class="bg-main-color w-full min-h-screen max-h-max pb-32 mt-6">
        <div class="text-white text-center">
            <h1 class="text-3xl font-bold">Toutes les cartes du jeu</h1>
            <h2>Pour l'instant</h2>
        </div>
        <div>
            <CardsContainer v-for="cardType in Object.keys(cards)" v-bind:key="cardType" v-bind:title="cardType" v-bind:cards="Object.values(cards[cardType])" class="pt-16 pl-16 pr-16" id="cardContainer"/>
        </div>
    </div>
</template>

<script>
import CardsContainer from '@/components/CardsContainer.vue'

let cards = require('../data/cards.json')

export default {
    name: 'App',
    components: {
        CardsContainer
    },
    data() {
        return {
            cards: cards
        }
    }
}

console.log(Object.keys(cards))
</script>

<style scoped>
@media screen and (max-width: 900px){
    #cardContainer {
        padding: 4rem 2rem 0rem 2rem;
    }
}
</style>