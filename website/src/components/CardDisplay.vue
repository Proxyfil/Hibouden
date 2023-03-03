<template>
    <div class="bg-gray-900 m-2 p-2 rounded-md" v-bind:class="rarity" id="cardContainer">
        <h1 class="text-white font-bold text-xl">{{ name }}</h1>
        <h2 class="text-white">{{ collection }}</h2>
        <h2 class="text-white flex">{{ scrap }} <img src="https://em-content.zobj.net/thumbs/120/microsoft/319/coin_1fa99.png" class="w-6 ml-1"></h2>
        <div class="flex justify-center">
            <img v-bind:src="img" alt="img" class="w-max mt-2"/>
        </div>
        <p class="text-xs text-gray-500 mt-2">ID : {{ id }}</p>
    </div>
</template>

<script>
export default {
    name: 'CardDisplay',
    components: {

    },
    props: {
        name: String,
        collection: String,
        scrap: Number,
        img: String,
        rarity: String,
        id: Number
    },
    data() {
        return {

        }
    }
}
</script>

<style scoped>
.common{
    border-top: 7px solid#46bb0b;
}

.funny{
    border-top: 7px solid #d0c112;
}

.legendary{
    border-top: 7px solid #d07812;
}

.recomposed{
    border-top: 7px solid #3f46cf;
}

.memories{
    border-top: 7px solid #e24141;
}

.classified{
    border-top: 7px solid #dc41dd;
}

.nft{
    border-top: 7px solid #00d819;
}

@media screen and (max-width: 500px) {
    div {
        margin: 4px;
    }

    #cardContainer {
        width: 100%;
    }
}
</style>