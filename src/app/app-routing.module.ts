import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryComponent } from './country/country.component';
import { WorldwideComponent } from './worldwide/worldwide.component';

const routes: Routes = [
  { path: "worldwide", component: WorldwideComponent},
  { path: 'country/:slug', component: CountryComponent },
  { path: "", pathMatch: "full", redirectTo: "worldwide"},
  { path: "**", redirectTo: "worldwide"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
