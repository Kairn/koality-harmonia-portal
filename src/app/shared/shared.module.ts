import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { U8Pipe } from './pipes/u8.pipe';

@NgModule({
  declarations: [U8Pipe],
  imports: [
    CommonModule
  ],
  exports: [
    U8Pipe
  ]
})
export class SharedModule { }
