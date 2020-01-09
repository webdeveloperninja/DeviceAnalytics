import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  ComponentFactoryResolver
} from '@angular/core';
import { NgxAdalService } from 'ngx-adal-8';
import { LoggedOutComponent } from 'src/app/components/logged-out/logged-out.component';

@Directive({ selector: '[appShowIfLoggedIn]' })
export class AppShowIfLoggedInDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private readonly adalAuthService: NgxAdalService,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    if (this.adalAuthService.isAuthenticated) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      const factory = this.resolver.resolveComponentFactory(LoggedOutComponent);
      this.viewContainer.createComponent(factory);
    }
  }
}
