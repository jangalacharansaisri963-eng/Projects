#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>


class QPushButton;
class QLabel;
class QListWidget;
class QLineEdit;


class MainWindow : public QMainWindow
{
    Q_OBJECT

public:

    MainWindow(QWidget *parent = nullptr);


private slots:

    void selectFolder();

    void scanFiles();


private:

    QLineEdit *folderPath;

    QPushButton *browseButton;

    QPushButton *scanButton;

    QListWidget *results;

    QLabel *status;
};


#endif
