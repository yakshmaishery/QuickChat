<svelte:head>
   <title>User Dashboard</title>
</svelte:head>
<script lang="ts">
   import { io } from "socket.io-client";
   import { enhance } from "$app/forms";
   import CommonNavBar from "$lib/Mycomponents/CommonNavBar.svelte";
   import '$lib/Styles/UserDashboard.css'
   import { Textarea, Toolbar, Heading, Drawer, Button, CloseButton, Input,Hr,SidebarCta,ToolbarButton,Listgroup,ButtonGroup } from 'flowbite-svelte';
   import { BarsOutline,ClipboardSolid,CaretRightSolid,PaperClipOutline } from 'flowbite-svelte-icons';
   import { sineIn } from 'svelte/easing';
   import { onMount } from "svelte";
   import Swal from "sweetalert2";

   export let data
   let hidden1 = true;
   let Attachmentdrawer = true;
   let transitionParams = {
      x: 320,
      duration: 200,
      easing: sineIn
   };
   let transitionParams1 = {
    x: -320,
    duration: 200,
    easing: sineIn
  };
   let currentGroupID = ""
   let socket: any;
   let message = '';
   let messages:any = [];
   let joinGroupID = ""
   let CurrentLoginID = data.LoginID
   let ServerAPI = "https://chatappserver-1yf9.onrender.com"
   // let ServerAPI = "http://localhost:3000"
   const CHUNK_SIZE = 64 * 1024; // 64 KB
   const receivedBuffers:any = {};
   let AttachmentsArray: { fileName: any; FILE: any;mimetype:string }[]=[]

   onMount(() => {
       socket = io(ServerAPI,{query:{CurrentLoginID:CurrentLoginID}}); // Replace with your server's URL
         // socket = io('http://localhost:3000',{query:{CurrentLoginID:CurrentLoginID}}); // Replace with your server's URL

        socket.on('connect', () => {
            console.log('Connected to the server');
        });

        // Listen for events in the room
         socket.on('joinRoomMessage', (data:any) => {
            debugger
            currentGroupID = data.key
            Swal.fire({title:"New Join",html:data.msg,confirmButtonColor:"green"})
            fetchUsers()
            fetchAttachments()
         });

         socket.on("UserLoggedIN",(data:string)=>{
            // alert(data)
            if(data == CurrentLoginID){
               handleSubmit()
            }
         })

         // Listen for incoming messages
         socket.on('message', (data:any) => {
            let Data = {CurrentLoginID:data.CurrentLoginID,message:data.message,datetime:new Date().toISOString()}
            messages = [...messages,Data]
            setTimeout(() => {
               const div = document.getElementById("scrollableDiv");
               if(div){
                  div.scrollTo({
                     top: div.scrollHeight+2000,
                     behavior: "smooth"
                  });
               }
            }, 100);
         });
         // Listen for incoming messages
         socket.on('leaveRoomMessage', (data:any) => {
            messages = []
            joinGroupID = ""
            currentGroupID = ""
            Swal.fire({title:"Left room",html:data.message,confirmButtonColor:"green"})
         });
         // Listen for incoming messages
         socket.on('leaveRoomMessageToAll', (data:any) => {
            Swal.fire({title:"Left room",html:data.message,confirmButtonColor:"green"})
         });

         socket.on('receive-file-chunk', (data:any) => {
            const { chunk, name, size, currentChunk } = data;

            if (!receivedBuffers[name]) {
               receivedBuffers[name] = [];
            }

            receivedBuffers[name].push(new Uint8Array(chunk));
            console.log(`Received chunk ${currentChunk} of ${name}`);
         });

         socket.on('receive-file-end', (data:any) => {
            const { name,mimetype } = data;

            // Combine the chunks and create a Blob for download
            const blob = new Blob(receivedBuffers[name]);
            // const link = document.createElement('a');
            // link.href = URL.createObjectURL(blob);
            // link.download = name;
            // link.click();
            blobToBase64(blob)
            .then(base64String => {
               // console.log(base64String);  // Base64 string
               AttachmentsArray.push({fileName:name,FILE:base64String,mimetype:mimetype})
            })
            UploadFileinDB(blob,currentGroupID,name,mimetype)

            // Cleanup
            delete receivedBuffers[name];
            console.log(`File ${name} has been downloaded.`);
            Swal.fire({icon:"success",title:"File Added in Attachments"})
         });

        return () => {
            socket.disconnect();
        };
    });

    const joinByCode = () => {
      // Request to join the generated room
      socket.emit('joinRoom', {joinGroupID,CurrentLoginID});
    }

    const SendMessges = () => {
      socket.emit('sendMessage', { CurrentLoginID,currentGroupID, message });
      message = ""
    }

    const CreateNewGroup = () => {
      const randomKey = Math.random().toString(36).substring(2, 15);
      joinGroupID = randomKey
      socket.emit('joinRoom', {joinGroupID,CurrentLoginID});
    }

    const LeaveRoom = () => {
      socket.emit('leaveRoom', { CurrentLoginID,currentGroupID });
    }

    const CopyMessage = (msg:string) => {
      navigator.clipboard.writeText(msg);
    }
    async function handleSubmit() {
        const formData = new FormData();
      //   formData.append('name', name);

        // Call the action using fetch
        const res = await fetch('/UserDashboard?/LogoutActionMethos', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            window.location.href="/"
            // responseMessage = result.message || 'Form submitted successfully!';
        } else {
            // responseMessage = 'Failed to submit form.';
        }
    }

    // Function to fetch data when button is clicked
  async function fetchUsers() {
    try {
      const response = await fetch(`${ServerAPI}/Messages`);  // API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const conversations = await response.json();
      messages = []
      conversations.filter((item:any)=>{
         if(item.RoomID == currentGroupID){
            let Data = {CurrentLoginID:item.UserLoginID,message:item.Message,datetime:item.Datetime}
            messages = [...messages,Data]
         }
      })
    } catch (err) {
      // error = err.message;
    } finally {
      // loading = false;  // Stop loading
    }
  }

  const callFileupload = () => {
   document.getElementById("fileinput")?.click()
  }

  const changeFileMethod = (event:any) => {
   const file = event.target.files[0];
   sendFile(file);
  }
  function sendFile(file:any) {
      const reader = new FileReader();
      let currentChunk = 0;

      reader.onload = (event:any) => {
         socket.emit('file-chunk', {
            currentGroupID,
            CurrentLoginID,
            name: file.name,
            size: file.size,
            chunk: event.target.result,
            currentChunk,
         });

         currentChunk++;
         if (currentChunk * CHUNK_SIZE < file.size) {
            readNextChunk();
         } else {
            socket.emit('file-end', { currentGroupID,CurrentLoginID, name: file.name,mimetype:file.type });
            Swal.fire({title:"File Uploaded",icon:"success"})
         }
      };

      const readNextChunk = () => {
         const start = currentChunk * CHUNK_SIZE;
         const end = Math.min(file.size, start + CHUNK_SIZE);
         const blob = file.slice(start, end);
         reader.readAsArrayBuffer(blob);
      };

      readNextChunk();
   }

   const downloadAttchment = (name:any,blob:any) => {
      const link = document.createElement('a');
      link.href = blob;
      link.download = name;
      link.click();
   }

   const UploadFileinDB = async (file:any,roomID:any,filename:any,mimetype:any) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('roomID', roomID);
      formData.append('filename', filename);
      formData.append('mimetype', mimetype);
      try {
          const response = await fetch(`${ServerAPI}/upload`, {
              method: 'POST',
              body: formData
          });
          if (!response.ok) {
              throw new Error('Failed to upload file.');
          }
          const result = await response.text();
         //  alert(`File uploaded successfully: ${result}`);
      } catch (error) {
          console.error('Error:', error);
         //  alert('Error uploading file.');
      }
   }

   async function fetchAttachments() {
    try {
      const response = await fetch(`${ServerAPI}/Attachments?roomID=${currentGroupID}`);  // API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const conversations = await response.json();
      AttachmentsArray = []
      conversations.filter((item:any)=>{
         let Data = {fileName:item.filename,FILE:item.FILE,mimetype:item.mimetype}
         AttachmentsArray = [...AttachmentsArray,Data]
         debugger
         // console.table(item)
         // navigator.clipboard.writeText(item.FILE);
         // if(item.RoomID == currentGroupID){
         // }
      })
    } catch (err) {
      // error = err.message;
      console.error(err)
    } finally {
      // loading = false;  // Stop loading
    }
  }

  function blobToBase64(blob:any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            // reader.result contains the base64 string (including the data URL prefix)
            if(reader.result){
               resolve(reader.result);  // Remove the data URL prefix (e.g., "data:image/png;base64,")
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        // Read the Blob as a data URL
        reader.readAsDataURL(blob);
    });
}
</script>
<div class="Maindash">
   <div>
      <CommonNavBar bind:LoginID = {data.LoginID}/>
   </div>
   <div style="overflow-y: auto;" id="scrollableDiv">
      <div class="chat-box">
         {#each messages as ele}
            <div class={`message ${ele.CurrentLoginID == data.LoginID?"sent":"received"}`}>
                <div class="message-info">
                    <span class="message-ID">
                        {ele.CurrentLoginID}
                        <Button on:click={()=>{CopyMessage(ele.message)}} class="clipboardbtn dark:bg-transparent"><ClipboardSolid/></Button>
                     </span>
                    <span class="timestamp">{ele.datetime}</span>
                </div>
                <div class="message-content"><pre class="dynamicMessage">{ele.message}</pre></div>
            </div>
         {/each}
      </div>
   </div>
   <div>
      <form>
         <Textarea class="" placeholder="Write a message" bind:value={message} disabled={currentGroupID != ""?false:true}>
           <div slot="footer" class="flex items-center justify-between">
            <div style="display: flex;gap:15px">
               <Button type="submit" disabled={currentGroupID != ""?false:true} on:click={SendMessges}>Send <CaretRightSolid/></Button>
               <input type="file" id="fileinput" hidden on:change={(e)=>{changeFileMethod(e)}}/>
               <Button on:click={callFileupload} disabled={currentGroupID != ""?false:true}>
                  <PaperClipOutline class="w-6 h-6" />
                  Upload file
               </Button>
            </div>
            <Toolbar embedded>
               <Button type="button" on:click={() => (hidden1 = false)}><BarsOutline/></Button>
               <!-- <ToolbarButton name="Set location"><MapPinAltSolid class="w-6 h-6" /></ToolbarButton> -->
               <!-- <ToolbarButton name="Upload image"><ImageOutline class="w-6 h-6" /></ToolbarButton> -->
             </Toolbar>
           </div>
         </Textarea>
       </form>
   </div>
</div>

<Drawer placement="right" transitionType="fly" transitionParams={transitionParams} bind:hidden={hidden1} id="sidebar6">
   <div class="flex items-center">
      <h5 id="drawer-navigation-label-3" class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
      <CloseButton on:click={() => (hidden1 = true)} class="mb-4 dark:text-white" />
    </div>
    <div>
      <Heading tag="h4">Welcome</Heading>
      <Heading tag="h5">{data.LoginID}</Heading>
      <br/>
      <hr/>
      <br/>
      <Button disabled={currentGroupID == ""?false:true} on:click={CreateNewGroup}>Create Group</Button>
      <Hr classHr="my-8 w-64">or</Hr>
      <form>
         <!-- <Label for="search" class="block mb-2">Your Email</Label> -->
         <Input id="search" placeholder="Enter Group ID" bind:value={joinGroupID} size="lg" disabled={currentGroupID == ""?false:true}>
           <!-- <SearchOutline slot="left" class="w-6 h-6 text-gray-500 dark:text-gray-400" /> -->
           <Button slot="right" size="sm" type="submit" disabled={currentGroupID == ""?false:true} on:click={joinByCode}>Join</Button>
         </Input>
      </form>
      <br/>
      <Button disabled={currentGroupID != ""?false:true} class="my-2" on:click={LeaveRoom}>Leave Group - {currentGroupID}</Button>
      <br/>
      <form method="post" use:enhance>
         <Button disabled={currentGroupID == ""?false:true} type="submit" class="my-2" formaction="/UserDashboard?/LogoutActionMethos" formmethod="POST">Logout</Button>
      </form>
      <br/>
      <ButtonGroup class="*:!ring-primary-700">
         <Button on:click={() => (Attachmentdrawer = false)} disabled={currentGroupID != ""?false:true}>
            <BarsOutline class="w-6 h-6" />
            Attachment List
         </Button>
       </ButtonGroup>
      <SidebarCta label="Note">
         <p class="mb-3 text-sm text-primary-900 dark:text-primary-400">The app is currently in its Beta version, so it may become inactive if left unused for more than 15 minutes.</p>
       </SidebarCta>
    </div>
</Drawer>
<Drawer transitionType="fly" bind:transitionParams={transitionParams1} bind:hidden={Attachmentdrawer} id="sidebar1" activateClickOutside={false}>
   <div class="flex items-center">
      <h5 id="drawer-navigation-label-3" class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Attachments</h5>
      <CloseButton on:click={() => (Attachmentdrawer = true)} class="mb-4 dark:text-white" />
    </div>
    <div style="margin-bottom: 20px;">
      
    </div>
   {#if AttachmentsArray.length > 0}
         <Listgroup active items={AttachmentsArray} let:item class="w-full" on:click={(e) => downloadAttchment(e.detail.fileName,e.detail.FILE)}>
            {item.fileName}
         </Listgroup>
       {/if}
</Drawer>