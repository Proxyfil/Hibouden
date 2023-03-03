<template>
    <nav class="flex justify-center bg-main-color text-white h-16">
        <ul class="flex justify-evenly w-1/5 mt-4">
            <li><router-link to="/" class="link pb-3" v-bind:class="{'active' : select=='home'}" v-on:click="select='home'">Accueil</router-link></li>
            <li><router-link to="/cards" class="link pb-3" v-bind:class="{'active' : select=='cards'}" v-on:click="select='cards'">Cartes</router-link></li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'NavbarComponent',
    components: {

    },
    data() {
        return {
            select: "home"
        }
    }
}
</script>

<style scoped>
.bg-main-color{
    background-color: #020202;
}

.link{
    transition: all 0.2s ease-in-out;
    border-bottom: 2px solid transparent;
}

.link:hover{
    color: #A0A0A0;
    border-bottom: 2px solid #A0A0A0;
}

.active{
    color: #808080;
    border-bottom: 2px solid #808080;
}
</style>