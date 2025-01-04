<svelte:head>
   <title>About Page</title>
</svelte:head>
<script lang="ts">
   import CommonNavBar from "$lib/Mycomponents/CommonNavBar.svelte";
   export let data;
   import { Timeline, TimelineItem } from 'flowbite-svelte';
   import { CalendarWeekSolid,ArrowRightAltSolid } from 'flowbite-svelte-icons';
</script>
<CommonNavBar bind:LoginID={data.LoginID}/>
<div style="display: flex;justify-content: left;padding-left:3%">
   <Timeline order="vertical">
      <TimelineItem title="Get Started" date="">
        <svelte:fragment slot="icon">
          <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
            <ArrowRightAltSolid class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </span>
        </svelte:fragment>
        <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Click on the <b>Get Started</b>. Enter your EmailID and click on <b>Login to your account</b></p>
      </TimelineItem>
      <TimelineItem title="Chat dashboard" date="">
        <svelte:fragment slot="icon">
          <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
            <ArrowRightAltSolid class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </span>
        </svelte:fragment>
        <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Click on the bar button at bottom side corner, Create a group by clicking on <b>Create Group</b> button or <b>Enter Group ID</b>.</p>
      </TimelineItem>
      <TimelineItem title="Start conversations" date="">
        <svelte:fragment slot="icon">
          <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
            <ArrowRightAltSolid class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </span>
        </svelte:fragment>
        <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Start with the conversations by sharing the group ID you can also upload file's in group which is listed in Attachment List</p>
      </TimelineItem>
   </Timeline>
</div>