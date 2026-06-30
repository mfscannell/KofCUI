import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'kofc-aboutKnights',
  templateUrl: './aboutKnights.component.html',
  styleUrls: ['./aboutKnights.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [YouTubePlayer],
})
export class AboutKnightsComponent implements OnInit {
  //safeUrl: SafeResourceUrl;
  @ViewChild('player') player: { mute: () => void } | undefined;
  videoId: string;

  constructor(private sanitizer: DomSanitizer) {
    this.videoId = 'nk6rLWUiKHY';
    //this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/watch?v=nk6rLWUiKHY');
  }

  ngOnInit() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  // Autoplay
  onReady() {
    this.player?.mute();
  }
}
