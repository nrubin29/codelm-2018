import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: {username: string, password: string} = {username: 'username', password: 'password'};

  constructor(private router: Router, private teamService: TeamService) { }

  ngOnInit() {
  }

  login() {
    this.teamService.login(this.user.username, this.user.password).then(() => {
      this.router.navigate(['dashboard']);
    }).catch(() => {
      alert('Incorrect username or password.');
    });
  }
}
