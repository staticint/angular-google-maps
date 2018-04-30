import { Directive, OnInit, Self, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FitBoundsService, FitBoundsAccessor, FitBoundsDetails } from '../services/fit-bounds';
import { Subscription } from 'rxjs/Subscription';
import { distinctUntilChanged } from 'rxjs/operators';
import { LatLng, LatLngLiteral } from '@agm/core';

/**
 * TODO: docs
 */
@Directive({
  selector: '[agmFitBounds]'
})
export class AgmFitBounds implements OnInit, OnDestroy, OnChanges {
  /**
   * If the value is true, the element gets added to the bounds of the map.
   * Default: true.
   */
  @Input() agmFitBounds: boolean = true;

  private _subscription: Subscription;
  private _latestFitBoundsDetails: FitBoundsDetails | null = null;

  constructor(
    @Self() private readonly _fitBoundsAccessor: FitBoundsAccessor,
    private readonly _fitBoundsService: FitBoundsService
  ) {}

  /**
   * @internal
   */
  ngOnChanges(changes: SimpleChanges) {
    this._updateBounds();
  }

  /**
   * @internal
   */
  ngOnInit() {
    this._subscription = this._fitBoundsAccessor
      .getFitBoundsDetails$()
      .pipe(
        distinctUntilChanged(
          (x: FitBoundsDetails, y: FitBoundsDetails) =>
            x.latLng.lat === y.latLng.lng
        )
      )
      .subscribe(details => this._updateBounds(details));
  }

  private _updateBounds(newFitBoundsDetails?: FitBoundsDetails) {
    if (newFitBoundsDetails) {
      this._latestFitBoundsDetails = newFitBoundsDetails;
    }
    if (!this._latestFitBoundsDetails) {
      return;
    }
    if (this.agmFitBounds) {
      this._fitBoundsService.addToBounds(this._latestFitBoundsDetails.latLng);
    } else {
      this._fitBoundsService.removeFromBounds(this._latestFitBoundsDetails.latLng);
    }
  }

  /**
   * @internal
   */
  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._latestFitBoundsDetails !== null) {
      this._fitBoundsService.removeFromBounds(this._latestFitBoundsDetails.latLng);
    }
  }
}
