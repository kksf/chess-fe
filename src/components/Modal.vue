<template>
  <div class="modal" v-if="show">
    <div class="message">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    show: Boolean,
  },
}
</script>

<style>
.modal {
  position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 10000;
  background: rgba(0, 0, 0, 0.8);
  display: flex; justify-content: center; align-items: center;
}
.message {
  background: #FFFFFF; color: black;
  position: relative; z-index: 10001;
  border-radius: 10px;
  padding: 1em;
}


</style>
