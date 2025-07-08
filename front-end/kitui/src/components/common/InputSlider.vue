<template>
  <div class="input-slider">
    <div class="slider-container">
      <input
          type="range"
          :min="min"
          :max="max"
          :step="step"
          :value="modelValue"
          @input="updateValue($event.target.value)"
          class="slider"
      />
    </div>
    <div class="numeric-input">
      <input
          type="number"
          :min="min"
          :max="max"
          :step="step"
          :value="modelValue"
          @input="updateValue($event.target.value)"
          class="number-input"
      />
      <span v-if="unit" class="unit">{{ unit }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InputSlider',
  props: {
    modelValue: {
      type: [Number, String],
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    unit: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  methods: {
    updateValue(value: string | number) {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      this.$emit('update:modelValue', numValue);
    }
  }
});
</script>

<style scoped>
.input-slider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.slider-container {
  flex: 1;
  position: relative;
}

.slider {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #42b983;
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background 0.2s, transform 0.1s;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #42b983;
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background 0.2s, transform 0.1s;
}

.slider::-webkit-slider-thumb:hover {
  background: #3aa876;
  transform: scale(1.1);
}

.slider::-moz-range-thumb:hover {
  background: #3aa876;
  transform: scale(1.1);
}

.slider:focus {
  outline: none;
}

.slider:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

.slider:focus::-moz-range-thumb {
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

.numeric-input {
  position: relative;
  width: 70px;
}

.number-input {
  width: 70%;
  padding: 0.375rem 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1f2937;
  -moz-appearance: textfield; /* Firefox */
}

.number-input::-webkit-inner-spin-button,
.number-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.unit {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.75rem;
  pointer-events: none;
}
</style>