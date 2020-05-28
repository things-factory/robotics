import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store } from '@things-factory/shell'

class HandEyeCalibrationGlobalSetting extends connect(store)(LitElement) {
  static get styles() {
    return css`
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
      img {
        flex: 1;
        margin: var(--wizard-view-item-margin, 10px 0);
      }
    `
  }

  static get properties() {
    return {
      settings: Object
    }
  }

  render() {
    return html`
      <h3>global setting</h3>

      <div>
        Sensor mount type
        <select>
          <option>Eye-to-Hand</option>
          <option>Eye-in-Hand</option>
        </select>
      </div>

      <div>
        AX=XB solver
        <select>
          <option>handeye</option>
          <option>Eye-in-Hand</option>
        </select>
      </div>

      <img
        src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMQDxAPEhMQDxAVDRYPEA8QFRsQEBAPFB0iFhYSExMYKCggGBoxHBMVIjEhJSkrLi4vFyI/RDMuNygtLisBCgoKDg0OFRAQFSsdFx0tLSsrLS0rNysrLS0tKystLS0rKzctLSstLS03LTctLS0rKy03LS0tKzc3Ky0tKy0tLf/AABEIAOEA4AMBIgACEQEDEQH/xAAbAAEBAAMBAQEAAAAAAAAAAAAAAQQFBgMCB//EADoQAAIBAgQEAwUGBQQDAAAAAAABAgMRBBIhMQVBUXEGImETMkKBsTNSkaHB0SNicnPwBxSi4RVTkv/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAaEQEBAQEAAwAAAAAAAAAAAAAAARExAhIh/9oADAMBAAIRAxEAPwD9vjFWWi2LlXRCOy7FAmVdEMq6IoAmVdEMq6IoAmVdEMq6IoAmVdEMq6IoAmVdEMq6IoAmVdEMq6IoAmVdEMq6I8ZY2mpZM8M9s2RNOeVbvKtbaosq+l1GTVrtvypL56/kB65V0Qyrojhqnj9xmm6UfZOeVPPaVuUru0bdrnYcOx0K9NVYXyvSzVmmt00TRk5V0QyroigomVdEMq6IoAmVdEMq6IoAmVdEMq6IoAmVdESUVZ6LY+iS2fYBHZdikjsuxQAAAAAAAAAAAAHxXlaMn0VwJKXrZfmzQV8bSljKuHqzShSw1OsoTnZVc7kpTlfRxjkStteWvI+KvEJS1dk+aWq+TNPxnheHxmT/AHFKFbJ7rnur7q65emxn2XG24HxCnWlUxsUvZzXssNpZPDQf2i9JSu16KJ78Z4wo0Kr2XspLTXVqy76tGs9qkklZJKyS0SS2SRjYypGcJQk/LKNmTVxzMIqUcskmnGzTWjT9Dq/9N5Sh7Wi3dZFUV3dpXcE7ctIr/wCTkHKUZumouUr+W3mck/iS5r0Wp+geB+E1KNOVSrdTnGMYxas1GN3ma5N325WE6V04ANsgAAAAAAABJbPsUktn2AR2XYpI7LsUAAAAAAAAAAABGr6FAHG8Rw0qNRwfuu7py6x6d0aqri7H6Di8LGrFwmrr80+qfJnE8Z4PKlLrF+7NfF6PozFjUrGwlSMpee9vR2Op4fgMPp/DhK+0pebXo78zi6ays3OCxzjFrdZduxIO0pUYx0jGMV0ikvofZ4YOtngnvyPc6MgAAAAAAAAAAEls+xSS2fYBHZdikjsuxQAAAAAAAAAAAAEbApgcSxEVBp2afJ637fufWMxaivX7v7/sc9jKzk7vVmbVkajFwWbTrsfLXkly8rV+l9LmRUibDg/CXWtKWlG+r/8AZ6R9OrMq33AINYeDd9by16bJ/gjYkStotEU6MgAAAAAAAAAAEls+xSS2fYBHZdikjsuxQAAAAAACNmPiMXkV8smvSy/JtMDJBrP/ADlJe/npv+eLt+MboyKPEqU7qE4ytvrsTRlSdv2MLF4q22r/ACX/AGTEYjlH5s1laZLVeVepcwK9Sx6VqutldtuyitW30SNxwng2VqpVs57xhvGHr6y+hnNVicK4K52qVU1HeNN6OXrPovQ6SKtotFslySKDcmMgAKAAAAAAAAAAAEls+xSS2fYBHZdikjsuxQAAAAADyqTt6pb/AOfgYVZOXm3GOq5ZOPWz/T9D7w07qxlWLUpRnCzV2nc1c68VdRSj201Rua0LM5zjGHdOedNqMvylzJRtFi80b7dV6mFUqSnJQgnKT2S+rfJep8cOwtSsrQXl51JaQXb7z7HT8O4fGhG0dZP3pv3pP9F6CTR48K4UqPml56rWsuUV92K5L15myANoAAAAAAAAAAAAAAAAEls+xSS2fYBHZdikjsuxQAAAAADW8aoNwVRbw1a6w5/uYuFq7Pkbw5nG4XJKdHaLWan/AE/df0M1W8nFSiYlShmtpGTTulJXTkttycFr3jkbu4+XXR25aPX0+RmVI5XcD3ozUoqS2a26eh9mNB5Z/wAs3delTmvn9U+pkmkAAAAAAAAAAAAAAAAAAAJLZ9ikls+wCOy7FJHZdigAAAAAAweLYX2kLr34+aPr1j8/2M4AcpTqONSFWLVnpK7srW5/JfkdNFqcb+hpOI4bJUa2hPzxt8Mlq0vnr8z34LiZeaEruz3fV7xvz636MzFZ6jmTg/k+afJr1PXDVHJa6STyyXr1Xpz+ZK0fiR51Xlaqra1qi6x+93X0uVGUCJlKAAAAAAAAAAAAAAAABJbPsUktn2AR2XYpI7LsUAAAAAAAADF4lhvaU2l7y80P6l/lvmc/fT2qbjKKvbk2tNVy5ps6o0PEaGSq1byVFf0zfEv1+ZmrG2wldTgmtV/mh9Lyv0Zp+D1PZuVO7bzN2tsuTb21/Q3bWZFg8aX8OWT4X9m+nWH7f9GSeDipJwfyfNPk16loVd4y0mt+SkuUl6FR7AXAAAAAAAAAAAAAAAJLZ9ikls+wCOy7FJHZdigAAAAAAAADD4rh89N296Pnj6tcvmrozABz+GqXSNrha19DVYil7OrKPwvzx7PdfiZFCrYxFbKs+eqMbHYKGJp5J91JaSi+qZ8YhRqZHK7cJZ42bVpWcdUt9JPRnzCtlZrRh4bg9Sm9JuNtpRb17x2NnhsTJSVKrbM15JrSNS26tyl6FlitDCxtXPGydpJ5oPmprVMnBuQeGCxHtKcJ7Xjquktmvxue5pAAAAAAAAAAACS2fYpJbPsAjsuxSR2XYoAAAAAAAAAAAYHGMI6lO8Le0jdwvrfrG3+bGmpYg6g1PFOE526lNqM+cX7s/wBn6mbFjGVY+JVjT41VYKUZRq0naymo3yvqpNOLPl42yu38+f4IyrZ4jEWW54U6l2av/fObtCLf80lZGxw1NrfVgb/gE/LUj0qXXaSv9bm0NNwN+eousIv6m5NzjNAAUAAAAAAAACS2fYpJbPsAjsuxSR2XYoAAAAAAAAAAAAAB8Vo3jJdYtHC06F0ux3k9n2ORw0PKuxnyWPLD4exmKB9wgfbRlWTwX7Sf9tfVm5NPwf7Wf9tfU3BucZoACgAAAAAAAASWz7FJLZ9gEdl2KSOy7FAAAAAAAAAAAAAc9468RLh2CniMueblGjShe2apP19EpP5AdBLZ9jl8IvKuxwOG8eSnWoLDzqUnfI8NNOpGrOWjz6aO99mu58+LMfj8BThkdalpq3BTh+Mk0Zv1rH6VFEmfn/hjxTiq1O9ScZO26pxX0Rp/E/jHHU6ihTq5E5W8tKDl8rpkMfr/AAf7WX9v9TcnF+BJV2lVxCqLPSUYyqLLed72tpb8DtDUSgAKgAAAAAAAASWz7FJLZ9gEdl2KSOy7FAAAAAAAAAAAAYuP4fSrqCqwVRQqqtBS+GpG6Uv+T/EygB+W+GPDGF4dxGs69ZTnFe0pSlDJTipt+XnqrGx8e+KKTpxo0akKrndWhJSV0r62Oi8SeFaWN80nKnUSsqkHlkvTQ/O+I/6RV87nSxCl/WtfnYy0xsPh6ipu0aiuvhUl9DVcKq1cPivayjUW7zVFJRvyu2dLg/CnF6CywnRa7zX0keWN8B8TxWlarSS52zS+rZFdvwTxfhsTh/41SnSq3dOpSctc0figt7c0bvguPVelni20pSjdqzkouybR+f8AAP8AShUWpVcROXWMPLddL72P0fAYOFCnGlTWWMVZI1NZrIABUAAAAAAAACS2fYpJbPsBjoAAAAAAAAAAAAAAAAAAUjAAAAAAAAAAAAAAAAYAH//Z"
      />
    `
  }
}

customElements.define('handeye-calib-global-setting', HandEyeCalibrationGlobalSetting)
