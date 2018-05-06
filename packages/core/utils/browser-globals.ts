import {Inject, Injectable, PLATFORM_ID, Provider} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable()
export class WindowRef {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}
  getNativeWindow(): any { return isPlatformBrowser(this.platformId) ? window : null; }
}

@Injectable()
export class DocumentRef {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}
  getNativeDocument(): any { return isPlatformBrowser(this.platformId) ? document : null; }
}

export const BROWSER_GLOBALS_PROVIDERS: Provider[] = [WindowRef, DocumentRef];
