<script lang="ts">
  import type { Durations } from '~core/database'
  import type {
    AddressWithPreferences,
    CommutePreference,
  } from '~core/types/address'
  import {
    CircleXSVG,
    RefreshSVG,
    RouteSVG,
    UprentLogoSVG,
    PencilPlusSVG,
  } from '~ui/assets'
  import { Button } from '~ui/components'
  import { fade, slide } from 'svelte/transition'

  import { timeFormatter } from '~core/helpers'

  import api from '~api'
  import addressService from '~core/services/address'

  let loading = false

  let durations: Durations | null = null
  let selectedAddress: string | null = null

  // Addresses saved in the database (localStorage for now)
  let savedAddresses: AddressWithPreferences[] | null = null

  // Modal states
  let addressModalOpened = false
  let modalInputAddress: string = ''
  let showSavedAddresses = false

  // Default commute preferences for new address
  let commutePrefs: CommutePreference = {
    walking: 30,
    biking: 45,
    car: 60,
    transit: 90,
  }

  // Address input
  let inputText: string = ''
  let displayAutocomplete: boolean = false

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

  const openModal = async () => {
    savedAddresses = await addressService.getSavedAddresses()
    addressModalOpened = true
    // Reset commute preferences
    commutePrefs = {
      walking: 30,
      biking: 45,
      car: 60,
      transit: 90,
    }
    // Initialize the addresses section as collapsed
    showSavedAddresses = false
  }

  const selectAddress = (addressItem: AddressWithPreferences) => {
    selectedAddress = addressItem.address
    inputText = addressItem.address
  }

  const saveAddress = async () => {
    const address = modalInputAddress.trim()

    if (address === '') {
      return
    }

    try {
      // Save address with commute preferences
      const addressWithPrefs: AddressWithPreferences = {
        address,
        commutePrefs: { ...commutePrefs },
      }
      await addressService.addAddress(addressWithPrefs)
      addressModalOpened = false
      modalInputAddress = ''
      selectAddress(addressWithPrefs)
      return
    } catch (error) {
      console.error('Error saving address:', error)
    }
  }

  const isExceedingTime = (duration: number, maxDuration: number): boolean => {
    return duration > maxDuration
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
      class="uprent .mx-auto .flex .w-2/5 .flex-col .gap-4 .rounded-lg .bg-white .p-4 xl:.w-1/3 lg:.w-1/3 md:.w-2/4 sm:.w-3/5 xs:.w-3/4"
      transition:fade={{ duration: 200 }}
    >
      <!-- Title -->
      <div class="uprent .flex .flex-row .justify-between">
        <h1 class="uprent .text-2xl .font-bold">Addresses</h1>
        <button
          class="uprent .rounded-lg .bg-white"
          on:click={() => (addressModalOpened = false)}
        >
          <span class=".text-red-500">
            <CircleXSVG />
          </span>
        </button>
      </div>
      <!-- Content -->
      <div class="uprent .flex .flex-col .gap-4">
        <div class=".flex .flex-col">
          <div class=".flex .flex-col .gap-2 .pb-4">
            <label class=".text-lg .font-semibold" for="address"
              >Enter a new address</label
            >
            <input
              type="text"
              id="address"
              placeholder="Eindhoven, Stratumseind 1"
              class="uprent .rounded-lg .border .border-gray-300 .p-2 .placeholder-gray-300 focus:.border-primary"
              bind:value={modalInputAddress}
            />
          </div>

          <!-- Commute Preferences -->
          <div class=".flex .flex-col .gap-2 .pb-4">
            <h2 class=".text-lg .font-semibold">
              Maximum commute times (minutes)
            </h2>

            <div class=".grid .grid-cols-2 .gap-3">
              <div class=".flex .flex-col .gap-1">
                <label class=".text-sm" for="walking">🚶 Walking</label>
                <input
                  type="number"
                  id="walking"
                  min="1"
                  max="120"
                  class="uprent .rounded-lg .border .border-gray-300 .p-2 focus:.border-primary"
                  bind:value={commutePrefs.walking}
                />
              </div>

              <div class=".flex .flex-col .gap-1">
                <label class=".text-sm" for="biking">🚲 Biking</label>
                <input
                  type="number"
                  id="biking"
                  min="1"
                  max="120"
                  class="uprent .rounded-lg .border .border-gray-300 .p-2 focus:.border-primary"
                  bind:value={commutePrefs.biking}
                />
              </div>

              <div class=".flex .flex-col .gap-1">
                <label class=".text-sm" for="car">🚗 Car</label>
                <input
                  type="number"
                  id="car"
                  min="1"
                  max="120"
                  class="uprent .rounded-lg .border .border-gray-300 .p-2 focus:.border-primary"
                  bind:value={commutePrefs.car}
                />
              </div>

              <div class=".flex .flex-col .gap-1">
                <label class=".text-sm" for="transit">🚌 Transit</label>
                <input
                  type="number"
                  id="transit"
                  min="1"
                  max="180"
                  class="uprent .rounded-lg .border .border-gray-300 .p-2 focus:.border-primary"
                  bind:value={commutePrefs.transit}
                />
              </div>
            </div>
          </div>

          <button
            class="uprent .mb-1 .flex .cursor-pointer .items-center .justify-between .border-b .border-gray-200 .bg-white .pb-1 .text-lg .font-semibold"
            on:click={() => {
              showSavedAddresses = !showSavedAddresses
            }}
            on:keydown={event => {
              if (event.key === 'Enter') {
                showSavedAddresses = !showSavedAddresses
              }
            }}
            aria-expanded={showSavedAddresses}
          >
            <span>My addresses</span>
            <span
              class=".text-xl .text-gray-500 .transition-transform {showSavedAddresses
                ? '.rotate-90'
                : ''}"
            >
              {'>'}
            </span>
          </button>

          {#if showSavedAddresses}
            <div
              class=".flex .max-h-64 .flex-col .gap-2 .overflow-y-auto .pb-2 .pr-1 .pt-4"
              transition:slide={{ duration: 200 }}
            >
              {#if savedAddresses != null}
                {#each savedAddresses as addressItem}
                  <div
                    class="uprent .mb-2 .flex .flex-col .border-b .border-gray-100 .pb-2"
                  >
                    <div class="uprent .flex .flex-row .justify-between">
                      <span class=".text-sm">{addressItem.address}</span>
                      <button
                        class="uprent .rounded-lg .bg-white"
                        on:click={async () => {
                          await addressService.removeAddress(addressItem)
                          savedAddresses = savedAddresses.filter(
                            item => item.address !== addressItem.address,
                          )
                        }}
                      >
                        <CircleXSVG />
                      </button>
                    </div>
                    <div
                      class=".mt-1 .flex .flex-wrap .gap-2 .text-xs .text-gray-500"
                    >
                      <span
                        >🚶 {addressItem.commutePrefs.walking}min / 🚲 {addressItem
                          .commutePrefs.biking}min / 🚗 {addressItem
                          .commutePrefs.car}min / 🚌 {addressItem.commutePrefs
                          .transit}min</span
                      >
                    </div>
                  </div>
                {/each}
              {/if}
              {#if savedAddresses && savedAddresses.length === 0}
                <span class="uprent .text-gray-500">No addresses saved</span>
              {/if}
            </div>
          {/if}
        </div>
        <div class="uprent .flex .flex-col .gap-2">
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
  </div>
{/if}

{#if !durations}
  <div
    class="uprent .m-2 .flex .w-64 .flex-col .gap-2 .rounded-lg .p-2 .shadow"
  >
    <div class=".flex .flex-row-reverse">
      <UprentLogoSVG />
    </div>
    <div class="uprent .relative">
      <input
        type="text"
        class="uprent .w-full .rounded-lg .border .border-gray-300 .p-2 .placeholder-gray-400 focus:.border-primary"
        bind:value={inputText}
        on:focus={async () => {
          savedAddresses = await addressService.getSavedAddresses()
          console
          displayAutocomplete = true
        }}
        on:blur={() => {
          displayAutocomplete = false
        }}
      />

      {#if displayAutocomplete}
        <div
          class="uprent .absolute .z-10 .flex .max-h-32 .w-full .flex-col .divide-y .divide-gray-200 .overflow-y-scroll .rounded-lg .border .bg-white .shadow"
          transition:slide={{ duration: 100 }}
        >
          <div
            class="uprent .flex .flex-row .justify-between .rounded-t-lg .bg-white .px-2 .py-1 .align-middle"
          >
            <span class="uprent .text-xs .font-light .text-gray-500">
              Saved addresses
            </span>
            <button
              class="uprent .rounded .border .border-gray-500 .bg-white .text-xs .font-light .text-primary hover:.bg-gray-100"
              on:mousedown={async () => {
                await openModal()
              }}
            >
              <PencilPlusSVG />
            </button>
          </div>
          {#if savedAddresses}
            <div class="uprent .flex .flex-col">
              {#each savedAddresses.filter(item => item.address
                  .toLowerCase()
                  .includes(inputText.toLowerCase())) as item}
                <button
                  class="uprent .flex .cursor-pointer .flex-row .overflow-hidden .text-ellipsis .whitespace-nowrap .bg-white .p-2 hover:.bg-primary hover:.text-white"
                  on:mousedown={() => {
                    console.log('Selected:', item)
                    inputText = item.address
                    displayAutocomplete = false
                    selectAddress(item)
                  }}
                >
                  <div class=".flex .w-full .flex-col">
                    <span class=".flex .flex-row">{item.address}</span>
                    <span class=".text-xs .text-gray-400">
                      🚶 {item.commutePrefs.walking}min / 🚲 {item.commutePrefs
                        .biking}min / 🚗 {item.commutePrefs.car}min / 🚌 {item
                        .commutePrefs.transit}min
                    </span>
                  </div>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <Button primary {loading} onClick={load} disabled={!selectedAddress}>
      <RouteSVG slot="icon" />
      Load commutes
    </Button>
  </div>
{:else}
  <div class="uprent .m-2 .flex .w-64 .flex-col .rounded-lg .p-2 .shadow">
    <div class=".flex .flex-row-reverse">
      <UprentLogoSVG />
    </div>
    <div class="uprent .flex .flex-row .items-center .gap-2">
      <button
        class="uprent .flex .size-6 .items-center .justify-center .bg-white .text-gray-500 hover:.rotate-90 hover:.text-primary"
        on:click={() => {
          durations = null
          selectedAddress = null
          inputText = ''
          loading = false
        }}
      >
        <RefreshSVG />
      </button>
      <span class="uprent .text-center .text-lg"> Commutes</span>
    </div>

    <div class=".flex .items-center">
      <div class=".mt-1 .italic .text-gray-700">
        {'to: 📍' + selectedAddress}
      </div>
    </div>

    <div
      class=" .flex .flex-col .items-start .justify-between .gap-2 .overflow-y-auto .rounded-lg .border .p-2"
    >
      {#each Object.entries(durations) as [key, duration] (key)}
        <div class=".flex .items-center .justify-between .gap-2 .align-middle">
          <span>
            {#if key === 'walking'}
              🚶
            {:else if key === 'biking'}
              🚲
            {:else if key === 'driving'}
              🚗
            {:else if key === 'transit'}
              🚌
            {/if}
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
