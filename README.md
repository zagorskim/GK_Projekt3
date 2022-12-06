# GK_Projekt3
Third project on Computer Graphics 1 classes

## Requirements
* npm 9.1.1 or newer

## Running app
Aby uruchomić wersję deweloperską aplikacji, po sklonowaniu repozytorium lokalnie należy z poziomu katalogu projektowego w terminalu wpisać poniższe polecenia:
* __npm i__
* __npm run dev__

Po uruchomianiu serwera deweloperskiego na terminalu pojawi się adres i port, pod jakim w przeglądarce można znaleźć aplikację.

## Additional info
* Grafiki testowe umieszczone są w katalogu GK_Projekt3/src/images/
* Na serwerze deweloperskim nie zaleca się testowania obrazów w wysokiej rozdzielczości z uwagi na potencjalny długi czas obliczeń
* Aby skompilować aplikację należy wykonać polecenie __npm run build__ a następnie program zbudowany w katalogu GK_Projekt3/build można uruchomić na przykład przy użyciu rozszerzenie do VSCode __Live Server__ 
* Algorytm propagacji błędu zawsze działa dla każdego kanału osobno, stąd dla wybranej liczby 2 kolorów palety wyjściowej, będzie to łącznie 8 możliwych do uzyskania barw
* Algorytm popularnościowy ma zaimplementowane obie opcje traktowania kanałów barw
* Algorytm k-średnich zawsze traktuje jedną barwę jako trzy składowe
* Do porównywania efektywności algorytmów zaleca się wybieranie obrazów testowych w odcieniach szarości, wtedy górny suwak określa rzeczywistą liczbę koloró na grafice wyjściowej
