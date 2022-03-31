# Project UI Submission

## Instructions

This project is hosted on Firebase: [Link to webapp](https://mazesoba-345315.web.app/)

GitHub URL: [Link to repo](https://github.com/Kitryn/it5007-project)

If you want to run the frontend locally instead of via Firebase, follow instructions under Project Structure > Running client locally with docker:

```bash
$ docker build --tag mazesoba .
$ docker run --init -it --publish 3000:3000 mazesoba
```

## Additional notes

The planned architecture is:

1. Frontend hosted via Firebase
2. Basic functions handled directly via Frontend <=> Firebase/Firestore/Auth
3. More complex functions (matching engine etc) handled via Frontend <=> Google Cloud Run <=> SQL/Redis/Firebase Auth/Infura

