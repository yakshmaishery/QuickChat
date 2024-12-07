<svelte:head>
   <title>About Page</title>
</svelte:head>
<script lang="ts">
   import CommonNavBar from "$lib/Mycomponents/CommonNavBar.svelte";
   export let data;
</script>
<CommonNavBar bind:LoginID={data.LoginID}/>