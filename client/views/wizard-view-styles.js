import { css } from 'lit-element'

export const WizardViewStyles = css`
  :host {
    display: flex;
    flex-direction: column;
  }

  h3 {
    margin: 0;
    color: var(--wizard-headline-color, #6e7ebd);
    text-transform: capitalize;
  }

  div {
    margin: var(--wizard-view-item-margin, 10px 0);
    padding: var(--wizard-view-item-padding, 5px 0);
    font-size: var(--wizard-view-font-size-default, 14px);
    color: var(--wizard-view-font-color, #4c526b);
  }

  input,
  select {
    display: block;
    border: 1px solid rgba(0, 0, 0, 0.2);
    min-width: var(--wizard-view-input-field-min, 90%);
    max-width: var(--wizard-view-input-field-max, 700px);
    padding: 2px 9px;
    font-size: var(--wizard-view-font-size-default, 18px);
  }

  mwc-button {
    --mdc-theme-primary: #fff;
    background-color: var(--wizard-view-button-background-color, #4c567f);
    margin: var(--wizard-view-button-margin, 10px 10px 10px 0);
    padding: var(--wizard-view-button-padding, 0px 5px);
    border-radius: var(--wizard-view-button-radius, 5px);
  }

  mwc-button:hover {
    background-color: var(--wizard-view-button-hover-background-color, #6e7ebd);
  }

  img,
  canvas {
    flex: 1;
    margin: var(--wizard-view-item-margin, 10px 0);
  }
`
