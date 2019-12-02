import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';

@NgModule({
  exports: [MatTableModule, MatPaginatorModule]
})
export class ThemeModule {}
