import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
  }


@Injectable()
export class AuthService {

  authState: any = null;

  // error messages
  public loginErrorMessage = new BehaviorSubject<string>('');
  public signupErrorMessage = new BehaviorSubject<string>('');
  public socialErrorMessage = new BehaviorSubject<string>('');
  public verifyAccountMessage = new BehaviorSubject<string>('');
  public resendLinkMessage = new BehaviorSubject<string>('');
  public resetPasswordMessage = new BehaviorSubject<string>('');

  public logged = new BehaviorSubject<boolean>(false);

  constructor(
      private afs: AngularFirestore,
      private afAuth: AngularFireAuth,
      private router: Router
    ) {
        afAuth.authState.subscribe((user) => {
            this.authState = user;
            if (user !== null) {
                this.logged.next(true);
            } else {
                this.logged.next(false);
            }
        });
    }

    // Returns true if user is logged in
    get authenticated(): boolean {
        return this.authState !== null;
    }

    // Returns current user data
    get currentUser(): any {
        return this.authenticated ? this.authState : '';
    }

    // Returns
    get currentUserObservable(): any {
        return this.afAuth.authState;
    }

    // Returns current user UID
    get currentUserId(): string {
        return this.authenticated ? this.authState.uid : '';
    }

    // social authentication

    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        this.socialSignIn(provider, 'google');
    }

    facebookLogin() {
        const provider = new firebase.auth.FacebookAuthProvider();
        this.socialSignIn(provider, 'facebook');
      }

    socialSignIn(provider, name) {
        this.clearMessages();
        this.afAuth.auth.signInWithPopup(provider)
          .then((credential) =>  {
              this.authState = credential.user;
              this.updateUserData();
          })
          .catch((error) => {
           // error handling
           this.socialErrorMessage.next(error.message);
        });
      }

    //// Anonymous Auth ////
    anonymousLogin() {
        return this.afAuth.auth.signInAnonymously()
        .then((user) => {
        this.authState = user;
        this.updateUserData();
        })
        .catch((error) => {
            console.log(error);
        });
    }

    //// Email/Password Auth ////
    emailSignUp(name: string, email: string, password: string) {
        this.clearMessages();
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
            this.authState = user;
            // send email verification
            const currentUser = this.afAuth.auth.currentUser;
            currentUser.updateProfile({
                displayName: name,
                photoURL: ''
            }).then(() => {
                currentUser.sendEmailVerification()
                .then(() => {
                    // console.log('email sent');
                })
                .catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                this.signupErrorMessage.next(error.message);
            });
            // this.updateUserData({fname: firstname, lname: lastname});
            this.signupErrorMessage.next('email');
        })
        .catch((error) => {
            this.signupErrorMessage.next(error.message);
            console.log(error);
        });
    }

    emailLogin(email: string, password: string) {
        this.clearMessages();
        if (this.authState !== null) {
            const emailVerified = this.authState.emailVerified;
            if (emailVerified) {
                this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
                    .then((user) => {
                        this.authState = user;
                        this.updateUserData();
                        this.loginErrorMessage.next('');
                    })
                    .catch((error) => {
                        this.loginErrorMessage.next(error.message);
                        console.log(error);
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            } else {
                this.verifyAccountMessage.next('You have not verified your email address');
            }
        } else {
            return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
                this.authState = user;
                this.updateUserData();
                this.loginErrorMessage.next('');
            })
            .catch((error) => {
                this.loginErrorMessage.next(error.message);
                console.log(error);
            });
        }
    }

    // Sends email allowing user to reset password
    resetPassword(email: string) {
        this.clearMessages();
        const auth = firebase.auth();

        return auth.sendPasswordResetEmail(email)
        .then(() => {
            this.resetPasswordMessage.next('reset');
        })
        .catch((error) => {
            this.resetPasswordMessage.next(error.message);
        });
    }

    // send verification email to the user
    sendVerificationEmail() {
        this.clearMessages();
        this.afAuth.auth.currentUser.sendEmailVerification()
        .then(() => this.resendLinkMessage.next('A verification link has been sent to your email!'))
        .catch((error) => {
            this.resendLinkMessage.next(error.message);
            console.log(error);
        });
    }


     //// Sign Out ////
    signOut(): void {
        this.afAuth.auth.signOut()
        .then(() => {
            this.logged.next(false);
            this.router.navigateByUrl('/login');
        });
    }

    //// Helpers ////
    private clearMessages() {
        this.socialErrorMessage.next('');
        this.loginErrorMessage.next('');
        this.resetPasswordMessage.next('');
        this.verifyAccountMessage.next('');
        this.resendLinkMessage.next('');
        this.signupErrorMessage.next('');
    }

    private updateUserData(opts?: any): void {
        const options = {
            name : this.authState.displayName,
            collectionName: 'users',
            ...opts
        };

        // Writes user name and email to firestore document
        // useful if your app displays information about users or for admin features
        const path = `${options.collectionName}/${this.currentUserId}`; // Endpoint on firebase
        const data = {
            email: this.authState.email,
            name: options.name
        };

        this.afs.doc(path).update(data)
        .then(() => {
            // document exist & document update successful
            // redirect loggedIn users to user only page after login
            this.logged.next(true);
            this.router.navigate(['/user']);
        })
        .catch((error) => {
            // document doesn't exist
            this.afs.doc(path).set(data);
            // redirect loggedIn users to user only page after login
            this.logged.next(true);
            this.router.navigate(['/user']);
        });

    }


}
