<script lang="ts">
  import type { Durations } from '~core/database'
  import {
    CircleXSVG,
    RefreshSVG,
    RouteSVG,
    UprentLogoSVG,
    UprentSVG,
  } from '~ui/assets'
  import { Button } from '~ui/components'
  import { fade, slide } from 'svelte/transition'

  import { timeFormatter } from '~core/helpers'

  import api from '~api'
  import AddressInput from '../address-input/address-input.svelte'
  import addressService from '~core/services/address'

  let loading = false
  let durations: Durations | null = null
  let selectedAddress: string | null = null

  let modalInputAddress: string = ''

  let addressModalOpened = false

  const isExtensionEnvironment = (): boolean => {
    return (
      chrome !== undefined &&
      chrome.runtime !== undefined &&
      chrome.runtime.sendMessage !== undefined
    )
  }

  const load = async () => {
    loading = true
    let data = null
    let error = null
    console.log('Loading commutes...')
    try {
      // Fix 1
      // Sends a message to the service-worker to set the extension's
      // origin instead of the client's (pararius).
      if (isExtensionEnvironment()) {
        console.log('Extension mode detected')
        chrome.runtime.sendMessage(
          {
            action: 'getCommutes',
          },
          response => {
            data = response.data
            error = response.error

            if (error) {
              console.error('Error loading commutes:', error)
              durations = null
              return
            }

            durations = data.payload.durations
          },
        )
      } else {
        console.log('Web mode detected')
        const { data, error } = await api.commute.durations.get()
        if (data && data.status === 'success') {
          durations = data.payload.durations
        } else {
          console.error('Error loading commutes:', error)
          durations = null
        }
      }
    } catch (e) {
      console.error('Error loading commutes:', e)
      loading = false
    }
  }

  const test = () => {
    if (isExtensionEnvironment()) {
      console.log('In extension environment')
      chrome.runtime.sendMessage(
        {
          action: 'getLocalStorage',
        },
        response => {
          console.log('Response:', response)
        },
      )
    }
  }

  const openModal = () => {
    console.log('Modal opened')
    addressModalOpened = true
  }

  const selectAddress = (value: string) => {
    console.log('Selected address:', value)
    selectedAddress = value
  }

  const saveAddress = async () => {
    const address = modalInputAddress.trim()
    if (address === '') {
      console.error('No address provided')
      return
    }

    await addressService.addAddress(address)
    addressModalOpened = false
    modalInputAddress = ''
    selectAddress(address)
    console.log('Address saved:', address)
  }
</script>

{#if addressModalOpened}
  <!-- Background -->
  <div
    class="uprent .fixed .inset-0 .z-[9999] .flex .flex-col .justify-center .bg-black/50"
    transition:fade={{ duration: 200 }}
  >
    <!-- Modal -->
    <div
      class="uprent .mx-auto .flex .w-2/5 .flex-col .gap-4 .rounded-lg .bg-white .p-4 xl:.w-1/4 lg:.w-1/3 md:.w-2/4 sm:.w-3/5 xs:.w-3/4"
      transition:fade={{ duration: 200 }}
    >
      <!-- Title -->
      <div class="uprent .flex .flex-row .justify-between">
        <h1 class="uprent .text-2xl">Add an address</h1>
        <button
          class="uprent .rounded-lg .bg-white"
          on:click={() => (addressModalOpened = false)}
        >
          <CircleXSVG />
        </button>
      </div>
      <!-- Content -->
      <div class="uprent .flex .flex-col .gap-2">
        <div class=".flex .flex-col .gap-2">
          <label for="address">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Enter address"
            class="uprent .rounded-lg .border .border-gray-300 .p-2"
            bind:value={modalInputAddress}
          />
        </div>
        <Button primary onClick={saveAddress}>Save</Button>
        <Button
          onClick={() => {
            addressModalOpened = false
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
{/if}

{#if !durations}
  <div
    class="uprent .m-2 .flex .w-64 .flex-col .gap-2 .rounded-lg .border .border-gray-300 .p-2"
  >
    <div class=".flex .flex-row-reverse">
      <UprentLogoSVG />
    </div>
    <AddressInput
      placeholder="Select an address"
      onChange={selectAddress}
      onAction={openModal}
    />
    <Button primary {loading} onClick={load} disabled={!selectedAddress}>
      <RouteSVG slot="icon" />
      Load commutes
    </Button>
  </div>
{:else}
  <div
    class="uprent .m-2 .flex .w-64 .flex-col .rounded-lg .border .border-gray-300 .p-2"
  >
    <div class=".flex .flex-row-reverse">
      <UprentLogoSVG />
    </div>
    <div class="uprent .flex .flex-row .items-center .gap-2">
      <button
        class="uprent .flex .size-6 .items-center .justify-center .bg-white .text-gray-500 hover:.rotate-90 hover:.text-primary"
        on:click={() => {
          durations = null
          selectedAddress = null
          loading = false
        }}
      >
        <RefreshSVG />
      </button>
      <span class="uprent .text-center .text-lg .font-bold"> Commutes</span>
    </div>
    <div
      class=" .flex .flex-col .items-start .justify-between .gap-2 .rounded-lg .border .p-2"
    >
      {#each Object.entries(durations) as [key, duration] (key)}
        <div class=".flex .items-center .justify-between .gap-2 .align-middle">
          <span>
            {key}:
          </span>
          {#if duration}
            <span class=".font-bold .text-primary"
              >{timeFormatter(duration)}</span
            >
          {:else}
            <span class=".text-gray-500">Not available</span>
          {/if}
        </div>
      {/each}
    </div>
    <!-- {JSON.stringify(durations, null, 2)} -->
  </div>
{/if}
