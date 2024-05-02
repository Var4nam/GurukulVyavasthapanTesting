import { LightningElement, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { CurrentPageReference } from "lightning/navigation";

export default class CheckLoginStatus extends NavigationMixin(
  LightningElement
) {
  // @track urlId;
  // @track showLoginButton = false;
  // @wire(CurrentPageReference)
  // setCurrentPageReference(currentPageReference) {
  //     const currentPage = currentPageReference.state.id;
  //     console.log('currentPage :::: ',currentPage);
  //     const teacherId = localStorage.getItem('idofTeacher');
  //     console.log('teacherId :::: ',teacherId);
  //     this.urlId = teacherId;
  //     if (currentPage == null) {
  //         this.checkUserLogin(null);
  //     }
  // }
  // connectedCallback() {
  //     this.checkDeviceStatus();
  // }
  // checkUserLogin(teacherId) {
  //     if (teacherId != '' && teacherId != undefined && teacherId != null) {
  //         this.showLoginButton = true;
  //     } else {
  //         localStorage.removeItem('deviceUniqueIdLogin');
  //         //window.location = '/s/Login';
  //         this[NavigationMixin.Navigate]({
  //             type: 'standard__webPage',
  //             attributes: {
  //                 url: '/s/login/'
  //             }
  //         });
  //     }
  // }
  // checkDeviceStatus() {
  //     const deviceUniqueIdOld = localStorage.getItem('deviceUniqueIdLogin');
  //     const fingerprint = navigator.userAgent + navigator.language + window.screen.width + window.screen.height;
  //     const currentDeviceUniqueId = btoa(fingerprint);
  //     if (this.urlId && deviceUniqueIdOld === currentDeviceUniqueId) {
  //         this.checkUserLogin(this.urlId);
  //     } else {
  //         this.checkUserLogin(null);
  //     }
  // }
  // handleClick(event) {
  //     localStorage.removeItem('deviceUniqueIdLogin');
  //     //window.location = '/s/login/';
  //     const selected = event.target.label;
  //     if (selected) {
  //       this[NavigationMixin.Navigate]({
  //         type: 'standard__webPage',
  //         attributes: {
  //           url: '/s/Login'
  //         }
  //       });
  //     }
  // }
}