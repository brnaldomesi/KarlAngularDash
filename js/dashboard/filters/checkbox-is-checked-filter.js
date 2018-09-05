angular.module('KARL.Filters')
    .filter('CheckBoxIsChecked', function ()
    {
        return function (isCheck)
        {
            if (isCheck == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    });
