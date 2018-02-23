import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../../../common/packets/login.response.packet';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  login(form: NgForm) {
    this.authService.login(form.value.username, form.value.password).then((response: LoginResponse) => {
      if (response === LoginResponse.SuccessAdmin) {
        this.router.navigate(['admin']);
      }

      else if (response === LoginResponse.SuccessTeam) {
        this.router.navigate(['dashboard']);
      }
    }).catch((response: LoginResponse | Error) => {
      alert(response);
    });
  }

  register() {
    this.router.navigate(['register']);
  }
}