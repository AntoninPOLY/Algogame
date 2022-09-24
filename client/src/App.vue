<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from 'vue'
import launch from './game/main.ts'

const launched = ref(false)
const name = ref('')
const error = ref('')
const launchGame = () => {
    if(name.value === '') {
        error.value = "Please enter a name"
        return false
    }
    const game = launch('gameContainer')
    error.value = ''
    console.log()
    game.name = name.value
    launched.value = true
}
</script>

<template>
    <div class="container">
        <input type="text" v-model="name" v-if="launched !== true" placeholder="Enter your name">
        <p v-if="error">{{error}}</p>
        <button  @click="launchGame" v-if="launched !== true">Launch Game</button>
        <div id="gameContainer"></div>
    </div>
</template>

<style scoped>

.container {
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    width:100vw;
    height:100vh;
}
p, a, button {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
}


button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #ffffff;
    border: solid 1px rgba(0,0,0,0.5);
    cursor: pointer;
    transition: border-color 0.25s;
}
button:hover {
    border-color: #646cff;
}
button:focus,
button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
}

</style>
