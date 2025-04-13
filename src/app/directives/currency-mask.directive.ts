import { Directive, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Directive({
  selector: "[currencyMask]",
  standalone: false
})
export class CurrencyMaskDirective implements OnInit, OnChanges {
  @Input() preValue?: string;
  @Input() control?: AbstractControl;
  
  constructor() {
  }

  ngOnInit(): void {
    console.log('CurrencyMaskDirective ngOnInit:' + this.preValue);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.preValue) {
      this.formatCurrency(changes.preValue.currentValue);
    }
  }

  private formatCurrency(event: string) {
      let newVal = '';

      if (event == null || event == undefined) {
        newVal = '0.00'
      } else {
        // Remove non-numeric values
        newVal = event.replace(/\D/g, "");
        // Remove leading zeros
        newVal = newVal.replace(/^0+/, '');

        if (newVal.length === 0) {
          newVal = "0.00"
        } else if (newVal.length === 1) {
          newVal = `0.0${newVal}`;
        } else if (newVal.length === 2) {
          newVal = `0.${newVal}`;
        } else {
          const dollarPart = newVal.slice(0, -2);
          const centsPart = newVal.slice(-2);
          newVal = `${dollarPart}.${centsPart}`;
        }
      }

      this.control?.setValue(newVal, { emitEvent: false })
  }
}