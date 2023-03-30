import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Fixture } from '../date-selector/date-selector.component';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.css'],
})
export class MatchDetailsComponent implements OnInit {
  match: Fixture;

  selectedMatch: any; // define the selectedMatch property
  matchDetails: any[] = []; // define the matchDetails property as an array
  markets: any[] = []; // define the markets property as an array
  legs: any[] = []; // define the legs property as an array
  selectedMarketId: number;
  selectionId: number;
  selectedOutcome: string;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const storedMatch = localStorage.getItem('selectedMatch');
    if (storedMatch) {
      this.selectedMatch = JSON.parse(storedMatch);
      console.log(this.selectedMatch.MatchId);
    }

    this.http
      .get('http://cms.bettorlogic.com/api/BetBuilder/GetMarkets?sports=1')
      .subscribe(
        (response: any) => {
          //console.log(response[0].MarketName);
          this.markets = response;
        },
        (error: any) => {
          console.error('Error fetching markets:', error);
        }
      );

    this.http
      .get('http://cms.bettorlogic.com/api/BetBuilder/GetSelections?sports=1')
      .subscribe((response: any) => {
        this.legs = response;
        //console.log(this.legs);
      });
  }

  getBetBuilderBets() {
    console.log('Method calling');

    const url = `http://cms.bettorlogic.com/api/BetBuilder/GetBetBuilderBets?sports=1&matchId=${this.selectedMatch.MatchId}&marketId=${this.selectedMarketId}&legs=${this.selectionId}&language=en`;
    this.http.get(url).subscribe((response: any) => {
      if (Array.isArray(response)) {
        this.matchDetails = response;
      } else {
        this.matchDetails = [response];
      }
      console.log(this.matchDetails);
    });
  }

  // This method will be called when the selected market changes
  onMarketChange() {
    const selectedMarket = this.markets.find(
      (market) => market.MarketId === this.selectedMarketId
    );
    const selectedMarketId = selectedMarket ? selectedMarket.MarketId : null;
    console.log(selectedMarketId); // You can replace this with your own code to display the selected market ID
  }

  onLegChange() {
    // Find the selected leg object from the legs array
    const selectedLeg = this.legs.find(
      (leg) => leg.selectionId === this.selectionId
    );
    console.log(selectedLeg);
  }
}
