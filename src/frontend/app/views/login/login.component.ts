import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../../../common/packets/login.response.packet';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: {username: string, password: string} = {username: '', password: ''};

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.user.username, this.user.password).then(response => {
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
}