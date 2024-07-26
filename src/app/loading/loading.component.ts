import { Component, Inject, OnInit } from '@angular/core';
import { FeatureLayerService } from '../../services/feature-layer.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements OnInit {
  isLoading: boolean = false;

  constructor(
    @Inject(FeatureLayerService)
    private featureLayerService: FeatureLayerService
  ) {}

  ngOnInit(): void {
    this.featureLayerService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }
}
