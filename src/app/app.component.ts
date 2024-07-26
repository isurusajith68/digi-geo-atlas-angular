import { Component, OnInit, Inject } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { FeatureLayerService } from '../services/feature-layer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  map!: Map;

  constructor(
    @Inject(FeatureLayerService)
    private featureLayerService: FeatureLayerService
  ) {}

  ngOnInit(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [-11800291.276185658, 8044275.224346006],
        zoom: 7.473917273236902,
      }),
    });

    this.featureLayerService.addFeaturesLayer(this.map);
  }
}
