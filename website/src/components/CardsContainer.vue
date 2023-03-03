<template>
    <div v-if="title!='deprecated'">
        <h1 class="text-white text-2xl font-bold" v-bind:class="title">{{ rarityTrad[title] }}</h1>
        <div class="grid-cols-5 inline-grid">
            <CardDisplay v-for="card in cards" v-bind:key="card.name" v-bind:name="card.name" v-bind:collection="card.collection" v-bind:scrap="card.scrap" v-bind:img="card.img" v-bind:rarity="title" v-bind:id="card.id" class="w-70"/>
        </div>
    </div>
</template>

<script>
import CardDisplay from '@/components/CardDisplay.vue'

export default {
    name: 'CardsContainer',
    components: {
        CardDisplay
    },
    props: {
        title: String,
        cards: Array
    },
    data() {
        return {
            rarityTrad: {
                "common": "Common",
                "funny": "Funny",
                "legendary": "Legendary",
                "recomposed": "Recomposed",
                "memories": "Memories",
                "classified": "Classified",
                "nft": "NFT"
            }
        }
    }
}
</script>

<style scoped>
.common{
    color: #46bb0b;
}

.funny{
    color: #d0c112;
}

.legendary{
    color: #d07812;
}

.recomposed{
    color: #3f46cf;
}

.memories{
    color: #e24141;
}

.classified{
    color: #dc41dd;
}

.nft{
    color: #00d819;
}
</style>