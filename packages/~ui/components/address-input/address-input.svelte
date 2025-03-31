<script lang="ts">
  import { PencilPlusSVG, PlusSVG } from '../../assets'
  import { slide } from 'svelte/transition'
  import addressService from '~core/services/address'

  export let placeholder: string = 'Type something...'
  export let onChange: ((value: any) => void) | undefined = undefined
  export let onAction: (() => void) | undefined = undefined

  let savedAddresses: string[] | null = null

  let selectedOption: any = null
  let inputText: string = ''
  let displayAutocomplete: boolean = false

  function handleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value

    selectedOption = value
    if (onChange !== undefined) {
      onChange(value)
    }
  }
</script>

<div class="uprent .relative">
  <input
    type="text"
    class="uprent .w-full .rounded-lg .border .border-gray-300 .p-2 .placeholder-gray-400 focus:.border-primary"
    {placeholder}
    bind:value={inputText}
    on:focus={async () => {
      savedAddresses = await addressService.getSavedAddresses()
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
          on:mousedown={() => {
            if (onAction !== undefined) {
              onAction()
            }
          }}
        >
          <PencilPlusSVG />
        </button>
      </div>
      {#if savedAddresses}
        <div class="uprent .flex .flex-col">
          {#each savedAddresses.filter(item => item
              .toLowerCase()
              .includes(inputText.toLowerCase())) as item}
            <button
              class="uprent .flex .cursor-pointer .flex-row .overflow-hidden .text-ellipsis .whitespace-nowrap .bg-white .p-2 hover:.bg-primary hover:.text-white"
              on:mousedown={() => {
                console.log('Selected:', item)
                selectedOption = item
                inputText = item
                displayAutocomplete = false
                if (onChange !== undefined) {
                  onChange(item)
                }
              }}
            >
              {item}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
