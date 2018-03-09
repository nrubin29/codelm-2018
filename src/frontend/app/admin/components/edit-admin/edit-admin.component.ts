import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AdminModel } from '../../../../../common/models/admin.model';
import { AdminService } from '../../../services/admin.service';
import { AdminsComponent } from '../../views/admins/admins.component';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.scss']
})
export class EditAdminComponent implements OnInit {
  @Input() admin: AdminModel;

  formGroup: FormGroup;
  originalPassword: string;

  constructor(private adminService: AdminService, private adminsComponent: AdminsComponent) { }

  ngOnInit() {
    this.admin = this.admin ? this.admin : {_id: undefined, name: undefined, superUser: false, username: undefined, password: undefined, salt: undefined};
    this.originalPassword = this.admin.password;

    this.formGroup = new FormGroup({
      _id: new FormControl(this.admin._id),
      name: new FormControl(this.admin.name),
      superUser: new FormControl(this.admin.superUser),
      username: new FormControl(this.admin.username),
      password: new FormControl('', Validators.required)
    });
  }

  submit(form: NgForm) {
    const admin = form.value;

    if (this.originalPassword === admin.password) {
      delete admin.password;
    }

    this.adminService.addOrUpdateAdmin(form.value).then(() => {
      this.adminsComponent.reload();
    }).catch(alert);
  }

  delete() {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.adminService.deleteAdmin(this.admin._id).then(() => {
        this.adminsComponent.reload();
      }).catch(alert);
    }
  }
}
