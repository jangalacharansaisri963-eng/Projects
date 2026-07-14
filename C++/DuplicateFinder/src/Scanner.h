#ifndef SCANNER_H
#define SCANNER_H

#include <QString>
#include <QStringList>


class Scanner
{

public:

    static QStringList scan(
        const QString &folder
    );

};


#endif
