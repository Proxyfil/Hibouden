<template>
    <div class="flex flex-col items-center">
        <h1 class="text-white text-3xl font-bold mt-6 text-center">Vous connaissez Hibouden ?</h1>
        <h3 class="text-xl text-white mt-12 mb-8">Nombre de cartes : {{ nb_cartes }}</h3>
        <div class="text-white w-fit">
            <p class="text-2xl font-bold">Chances de drop :</p><br>
            <p class="text-xl common">Common : 40%</p>
            <p class="text-xl funny">Funny : 25%</p>
            <p class="text-xl legendary">Legendary : 20%</p>
            <p class="text-xl recomposed">Recomposed : 10%</p>
            <p class="text-xl memories">Memories : 4%</p>
            <p class="text-xl classified">Classified : 1%</p>
            <p class="text-xl nft">NFT : 0%</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomePage',
    components: {

    },
    data() {
        return {
            nb_cartes: 230
        }
    },
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